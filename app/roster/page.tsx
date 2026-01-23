
"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { RosterBoard } from "@/components/roster/roster-board"
import { RosterDetails } from "@/components/roster/roster-details"
import apiClient from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Zap, Filter, Users, Clock } from "lucide-react"
import { mockRosterItems, mockBeatCapacities, autoAssignRosterItems, mockAutoAssignRules } from "@/lib/roster-data"
import type { RosterItem } from "@/types/roster"
import { useApiQuery } from "@/hooks/use-api-query"

import { ProtectedRoute } from "@/components/auth/protected-route"

export default function RosterPage() {
  // ... existing state ...
  const [rosterItems, setRosterItems] = useState<RosterItem[]>([])
  const [selectedItem, setSelectedItem] = useState<RosterItem | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedShift, setSelectedShift] = useState<string>("morning")
  const [isAutoAssigning, setIsAutoAssigning] = useState(false)

  const fetchRoster = useCallback(() => apiClient.getRosterItems({ date: selectedDate, shift: selectedShift }), [selectedDate, selectedShift])
  const { data: rosterData, loading, refetch } = useApiQuery<{ data: RosterItem[] }>(fetchRoster, { refetchOnMount: true })

  useEffect(() => {
    if (rosterData?.data) {
      setRosterItems(rosterData.data)
    }
  }, [rosterData])

  // Initialize selectedDate on client side to avoid SSR hydration mismatch
  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleItemClick = (item: RosterItem) => {
    setSelectedItem(item)
  }

  const handleItemMove = async (itemId: string, toBeatId: string | null) => {
    if (!toBeatId) return;
    try {
      // Assuming apiClient is imported or available in scope
      // For example: import { apiClient } from "@/lib/api";
      // This change only modifies the function body as requested.
      await apiClient.assignRosterItem(itemId, toBeatId);
      refetch();
    } catch (error) {
      console.error("Failed to assign", error);
    }
  }

  const handleAssign = (itemId: string, beatId: string, notes?: string) => {
    const beat = mockBeatCapacities.find((b) => b.beatId === beatId)
    if (!beat) return

    setRosterItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
            ...item,
            beatId,
            postId: beat.postId,
            status: "assigned" as const,
            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            notes,
            updatedAt: new Date().toISOString(),
          }
          : item,
      ),
    )

    // Update capacity
    beat.currentAssigned++
  }

  const handleAutoAssign = async () => {
    setIsAutoAssigning(true)
    try {
      await apiClient.autoAssignRoster(selectedDate, selectedShift)
      refetch()
    } catch (error) {
      console.error('Auto assign failed:', error)
    } finally {
      setIsAutoAssigning(false)
    }
  }

  const stats = {
    total: rosterItems.length,
    unassigned: rosterItems.filter((item) => item.status === "unassigned").length,
    assigned: rosterItems.filter((item) => item.status === "assigned").length,
    highPriority: rosterItems.filter((item) => item.priority === "high").length,
    overdue: rosterItems.filter((item) => {
      if (!item.lastVisitAt) return false
      const daysSince = Math.floor((Date.now() - new Date(item.lastVisitAt).getTime()) / (1000 * 60 * 60 * 24))
      return daysSince > 7
    }).length,
  }

  return (
    <ProtectedRoute permissionCode="operations.roster">
      <DashboardLayout title="Duty Roster" description="Manage officer shifts and assignments">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Roster Assignment Board</h1>
              <p className="text-muted-foreground">Manage daily assignments for senior citizen visits</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button size="sm" onClick={handleAutoAssign} disabled={isAutoAssigning}>
                <Zap className="h-4 w-4 mr-2" />
                {isAutoAssigning ? "Auto Assigning..." : "Auto Assign"}
              </Button>
            </div>
          </div>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Shift:</label>
                  <Select value={selectedShift} onValueChange={setSelectedShift}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Citizens</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <div>
                    <p className="text-2xl font-bold">{stats.unassigned}</p>
                    <p className="text-xs text-muted-foreground">Unassigned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.assigned}</p>
                    <p className="text-xs text-muted-foreground">Assigned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.highPriority}</p>
                    <p className="text-xs text-muted-foreground">High Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.overdue}</p>
                    <p className="text-xs text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Board */}
          <div className="flex gap-6 h-[600px]">
            <div className="flex-1">
              <RosterBoard
                items={rosterItems}
                capacities={mockBeatCapacities}
                onItemClick={handleItemClick}
                onItemMove={handleItemMove}
              />
            </div>

            {selectedItem && (
              <RosterDetails
                item={selectedItem}
                capacities={mockBeatCapacities}
                onClose={() => setSelectedItem(null)}
                onAssign={handleAssign}
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
