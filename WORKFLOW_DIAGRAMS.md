# Senior Citizen Portal - Workflow Diagrams

This document contains comprehensive Mermaid workflow diagrams organized by **modules** and **roles**.

---

## Part 1: Module-wise Workflows

### 1.1 Authentication Module

```mermaid
flowchart TD
    subgraph AuthFlow["Authentication Flow"]
        Start([User Access]) --> Choice{Has Account?}

        Choice -->|No| Register[Register]
        Register --> EnterDetails[Enter Email/Phone/Password]
        EnterDetails --> SendOTP[Send OTP]
        SendOTP --> VerifyOTP[Verify OTP]
        VerifyOTP --> AccountCreated[Account Created]
        AccountCreated --> Login

        Choice -->|Yes| Login[Login]
        Login --> AuthMethod{Auth Method}

        AuthMethod -->|Password| PasswordAuth[Enter Credentials]
        PasswordAuth --> ValidateCreds{Valid?}
        ValidateCreds -->|Yes| GenerateToken[Generate JWT Token]
        ValidateCreds -->|No| LoginError[Show Error]
        LoginError --> Login

        AuthMethod -->|OTP| OTPAuth[Request OTP]
        OTPAuth --> EnterOTP[Enter OTP]
        EnterOTP --> VerifyLogin{Valid?}
        VerifyLogin -->|Yes| GenerateToken
        VerifyLogin -->|No| LoginError

        GenerateToken --> StoreToken[Store Token in Client]
        StoreToken --> Dashboard[Access Dashboard]

        Dashboard --> RefreshCheck{Token Expiring?}
        RefreshCheck -->|Yes| RefreshToken[Refresh Token]
        RefreshToken --> Dashboard
        RefreshCheck -->|No| Continue[Continue Working]

        Dashboard --> Logout[Logout]
        Logout --> InvalidateToken[Invalidate Token]
        InvalidateToken --> Start
    end
```

### 1.2 Citizen Management Module

```mermaid
flowchart TD
    subgraph CitizenMgmt["Citizen Management"]
        Start([Admin/Officer Login]) --> CitizenList[View Citizen List]

        CitizenList --> Filter{Apply Filters?}
        Filter -->|Yes| SetFilter[Set Filters]
        SetFilter --> ApplyFilter[Police Station/Beat/Status]
        ApplyFilter --> CitizenList
        Filter -->|No| Action{Select Action}

        Action -->|Add New| CreateCitizen[Create Citizen Form]
        CreateCitizen --> EnterDetails[Enter Personal Info]
        EnterDetails --> CheckDuplicate[Check Duplicates]
        CheckDuplicate --> DupFound{Duplicates Found?}
        DupFound -->|Yes| ReviewDup[Review Duplicates]
        ReviewDup --> Proceed{Proceed Anyway?}
        Proceed -->|No| CreateCitizen
        Proceed -->|Yes| SaveCitizen
        DupFound -->|No| SaveCitizen[Save Citizen]
        SaveCitizen --> AssignBeat[Assign to Beat]
        AssignBeat --> UploadDocs[Upload Documents]
        UploadDocs --> SetVerification[Set Verification Status]
        SetVerification --> CitizenList

        Action -->|View Details| ViewCitizen[View Citizen Profile]
        ViewCitizen --> SubAction{Sub-Action}
        SubAction -->|Edit| EditCitizen[Edit Details]
        EditCitizen --> SaveChanges[Save Changes]
        SaveChanges --> ViewCitizen
        SubAction -->|Documents| ManageDocs[Manage Documents]
        ManageDocs --> ViewCitizen
        SubAction -->|Visits| ViewVisits[View Visit History]
        ViewVisits --> ViewCitizen
        SubAction -->|SOS| ViewSOS[View SOS History]
        ViewSOS --> ViewCitizen
        SubAction -->|Issue Card| IssueCard[Issue Digital Card]
        IssueCard --> ViewCitizen

        Action -->|Map View| MapView[View on Map]
        MapView --> ClickMarker[Click Marker]
        ClickMarker --> ViewCitizen

        Action -->|Export| ExportData[Export to CSV/JSON]
        ExportData --> DownloadFile[Download File]
    end
```

### 1.3 Officer Management Module

```mermaid
flowchart TD
    subgraph OfficerMgmt["Officer Management"]
        Start([Admin Login]) --> OfficerList[View Officer List]

        OfficerList --> Stats[View Statistics]
        Stats --> Workload[View Workload Distribution]

        OfficerList --> Action{Action}

        Action -->|Add| CreateOfficer[Create Officer]
        CreateOfficer --> EnterInfo[Enter Name/Rank/Badge/Phone]
        EnterInfo --> AssignStation[Assign Police Station]
        AssignStation --> AssignBeat[Assign Beat]
        AssignBeat --> CreateUser[Create User Account]
        CreateUser --> SetPermissions[Configure Permissions]
        SetPermissions --> SaveOfficer[Save Officer]
        SaveOfficer --> OfficerList

        Action -->|View| ViewOfficer[View Officer Profile]
        ViewOfficer --> SubAction{Sub-Action}
        SubAction -->|Edit| EditOfficer[Edit Details]
        EditOfficer --> ViewOfficer
        SubAction -->|Transfer| TransferFlow
        SubAction -->|History| ViewHistory[View Transfer History]
        ViewHistory --> ViewOfficer
        SubAction -->|Performance| ViewPerf[View Performance Metrics]
        ViewPerf --> ViewOfficer

        Action -->|Transfer| TransferFlow[Transfer Officer]
        TransferFlow --> Preview[Preview Transfer Impact]
        Preview --> SelectNewBeat[Select New Beat/Station]
        SelectNewBeat --> SetDate[Set Effective Date]
        SetDate --> AddReason[Add Transfer Reason]
        AddReason --> ConfirmTransfer[Confirm Transfer]
        ConfirmTransfer --> OfficerList

        Action -->|Roster| RosterView[View Beat Roster]
        RosterView --> DragDrop[Drag and Drop Officers]
        DragDrop --> AutoTransfer[Auto-Create Transfer]
        AutoTransfer --> RosterView
    end
```

### 1.4 Visit Management Module

```mermaid
flowchart TD
    subgraph VisitMgmt["Visit Management"]
        Start([User Login]) --> VisitView{View Type}

        VisitView -->|List| VisitList[Visit List]
        VisitView -->|Calendar| CalendarView[Calendar View]
        VisitView -->|Stats| StatsView[Statistics Dashboard]

        CalendarView --> SelectDate[Select Date Range]
        SelectDate --> ViewEvents[View Visit Events]
        ViewEvents --> ClickEvent[Click Visit]
        ClickEvent --> VisitDetails

        VisitList --> Filter[Apply Filters]
        Filter --> ByStatus[By Status]
        Filter --> ByType[By Visit Type]
        Filter --> ByDate[By Date Range]
        Filter --> ByOfficer[By Officer]

        VisitList --> Action{Action}

        Action -->|Schedule| ScheduleVisit[Schedule New Visit]
        ScheduleVisit --> SelectCitizen[Select Citizen]
        SelectCitizen --> SelectOfficer[Assign Officer]
        SelectOfficer --> SetDateTime[Set Date and Time]
        SetDateTime --> SetType[Set Visit Type]
        SetType --> AddNotes[Add Notes]
        AddNotes --> SaveVisit[Save Visit]
        SaveVisit --> NotifyParties[Notify Officer and Citizen]
        NotifyParties --> VisitList

        Action -->|Auto-Schedule| AutoSchedule[Auto-Schedule Visits]
        AutoSchedule --> SetRange[Set Date Range]
        SetRange --> RunAlgorithm[Run Scheduling Algorithm]
        RunAlgorithm --> ReviewSchedule[Review Proposed Schedule]
        ReviewSchedule --> Approve{Approve?}
        Approve -->|Yes| ConfirmAll[Confirm All Visits]
        Approve -->|No| AdjustManual[Adjust Manually]
        AdjustManual --> ConfirmAll
        ConfirmAll --> VisitList

        Action -->|View| VisitDetails[View Visit Details]
        VisitDetails --> VisitAction{Visit Action}
        VisitAction -->|Start| StartVisit[Start Visit]
        StartVisit --> CaptureLocation[Capture GPS Location]
        CaptureLocation --> InProgress[Mark In Progress]
        InProgress --> VisitDetails

        VisitAction -->|Complete| CompleteVisit[Complete Visit]
        CompleteVisit --> FillForm[Fill Assessment Form]
        FillForm --> TakePhoto[Take Photo]
        TakePhoto --> AddObservations[Add Observations]
        AddObservations --> SetRiskScore[Set Risk Score]
        SetRiskScore --> SubmitCompletion[Submit Completion]
        SubmitCompletion --> VisitList

        VisitAction -->|Cancel| CancelVisit[Cancel Visit]
        CancelVisit --> AddReason[Add Cancellation Reason]
        AddReason --> ConfirmCancel[Confirm Cancellation]
        ConfirmCancel --> VisitList
    end
```

### 1.5 SOS Alert Module

```mermaid
flowchart TD
    subgraph SOSModule["SOS Alert System"]
        subgraph CitizenSide["Citizen Side"]
            Panic([Panic Button Pressed]) --> GetLocation[Get GPS Location]
            GetLocation --> CreateAlert[Create SOS Alert]
            CreateAlert --> SendNotif[Send Notifications]
            SendNotif --> OfficerNotif[Notify Assigned Officer]
            SendNotif --> ControlRoom[Notify Control Room]
            SendNotif --> EmergencyContact[Notify Emergency Contacts]
        end

        subgraph AdminSide["Control Room / Admin Side"]
            Dashboard([SOS Dashboard]) --> ActiveAlerts[View Active Alerts]
            ActiveAlerts --> MapView[View on Real-time Map]
            MapView --> SelectAlert[Select Alert]
            SelectAlert --> AlertDetails[View Alert Details]
            AlertDetails --> CitizenInfo[View Citizen Info]
            AlertDetails --> LocationHistory[View Location Trail]

            AlertDetails --> Action{Take Action}
            Action -->|Respond| RespondAlert[Mark as Responded]
            RespondAlert --> AssignOfficer[Assign Responding Officer]
            AssignOfficer --> TrackProgress[Track Progress]

            Action -->|Resolve| ResolveAlert[Resolve Alert]
            ResolveAlert --> AddNotes[Add Resolution Notes]
            AddNotes --> SetOutcome[Set Outcome]
            SetOutcome --> CloseAlert[Close Alert]

            Action -->|False Alarm| FalseAlarm[Mark False Alarm]
            FalseAlarm --> AddReason[Add Reason]
            AddReason --> CloseAlert

            CloseAlert --> NotifyCitizen[Notify Citizen]
            NotifyCitizen --> Dashboard
        end

        subgraph Statistics["Analytics"]
            StatsView([Statistics View]) --> ResponseTime[Avg Response Time]
            StatsView --> AlertsByArea[Alerts by Area]
            StatsView --> TrendAnalysis[Trend Analysis]
            StatsView --> OfficerPerformance[Officer Response Performance]
        end
    end
```

### 1.6 Reports Module

```mermaid
flowchart TD
    subgraph ReportsModule["Reports and Analytics"]
        Start([Reports Dashboard]) --> ReportType{Select Report}

        ReportType -->|Dashboard| DashboardStats[Dashboard Statistics]
        DashboardStats --> TotalCitizens[Total Citizens]
        DashboardStats --> TotalOfficers[Total Officers]
        DashboardStats --> TotalVisits[Visit Summary]
        DashboardStats --> SOSStats[SOS Statistics]

        ReportType -->|Demographics| Demographics[Citizen Demographics]
        Demographics --> AgeDistribution[Age Distribution]
        Demographics --> GenderSplit[Gender Split]
        Demographics --> VulnerabilityLevels[Vulnerability Levels]
        Demographics --> LivingArrangements[Living Arrangements]

        ReportType -->|Visits| VisitAnalytics[Visit Analytics]
        VisitAnalytics --> SetDateRange[Set Date Range]
        SetDateRange --> SelectGrouping[Group By Day/Week/Month]
        SelectGrouping --> ViewCharts[View Charts]
        ViewCharts --> CompletionRates[Completion Rates]
        ViewCharts --> VisitsByType[Visits by Type]
        ViewCharts --> OfficerProductivity[Officer Productivity]

        ReportType -->|Performance| PerformanceReport[Officer Performance]
        PerformanceReport --> SelectStation[Select Police Station]
        SelectStation --> ViewMetrics[View Metrics]
        ViewMetrics --> VisitsCompleted[Visits Completed]
        ViewMetrics --> ResponseTimes[Response Times]
        ViewMetrics --> CitizensCovered[Citizens Covered]
        ViewMetrics --> Rankings[Officer Rankings]

        ReportType -->|Export| ExportData[Export Data]
        ExportData --> SelectType[Select Data Type]
        SelectType --> CitizensExport[Citizens]
        SelectType --> VisitsExport[Visits]
        SelectType --> SOSExport[SOS Alerts]

        CitizensExport --> SelectFormat{Format}
        VisitsExport --> SelectFormat
        SOSExport --> SelectFormat

        SelectFormat -->|CSV| DownloadCSV[Download CSV]
        SelectFormat -->|JSON| DownloadJSON[Download JSON]
    end
```

### 1.7 Master Data Module

```mermaid
flowchart TD
    subgraph MasterData["Master Data Management"]
        Start([Admin Panel]) --> Category{Select Category}

        Category -->|Hierarchy| HierarchyMgmt[Hierarchy Management]
        HierarchyMgmt --> Ranges[Manage Ranges]
        HierarchyMgmt --> Districts[Manage Districts]
        HierarchyMgmt --> SubDivisions[Manage Sub-Divisions]
        HierarchyMgmt --> PoliceStations[Manage Police Stations]
        HierarchyMgmt --> Beats[Manage Beats]

        Ranges --> CRUD1[Create/Read/Update/Delete]
        Districts --> CRUD1
        SubDivisions --> CRUD1
        PoliceStations --> CRUD1
        Beats --> CRUD1

        Category -->|Lookup| LookupMgmt[Lookup Data]
        LookupMgmt --> LivingArrangements[Living Arrangements]
        LookupMgmt --> HealthConditions[Health Conditions]
        LookupMgmt --> MaritalStatuses[Marital Statuses]
        LookupMgmt --> RiskFactors[Risk Factors]
        LookupMgmt --> VisitTypes[Visit Types]
        LookupMgmt --> Designations[Designations]

        LivingArrangements --> CRUD2[Create/Read/Update/Delete]
        HealthConditions --> CRUD2
        MaritalStatuses --> CRUD2
        RiskFactors --> CRUD2
        VisitTypes --> CRUD2
        Designations --> CRUD2

        Category -->|Roles| RoleMgmt[Role Management]
        RoleMgmt --> ViewRoles[View Roles]
        ViewRoles --> RoleMatrix[View Permission Matrix]
        RoleMgmt --> CreateRole[Create Custom Role]
        CreateRole --> AssignPermissions[Assign Permissions]
        AssignPermissions --> SaveRole[Save Role]

        Category -->|Config| SystemConfig[System Configuration]
        SystemConfig --> VisitSettings[Visit Settings]
        SystemConfig --> SOSSettings[SOS Settings]
        SystemConfig --> NotifSettings[Notification Settings]
        SystemConfig --> SecuritySettings[Security Settings]
    end
```

### 1.8 Notification Module

```mermaid
flowchart TD
    subgraph NotificationModule["Notification System"]
        subgraph UserNotif["User Notifications"]
            UserDashboard([User Dashboard]) --> ViewNotif[View Notifications]
            ViewNotif --> NotifList[Notification List]
            NotifList --> ReadNotif[Mark as Read]
            NotifList --> MarkAllRead[Mark All as Read]
            NotifList --> DeleteNotif[Delete Notification]
        end

        subgraph AdminNotif["Admin Notifications"]
            AdminPanel([Admin Panel]) --> SendNotif[Send Notification]

            SendNotif --> SingleSend[Single Notification]
            SingleSend --> SelectRecipient[Select Recipient]
            SelectRecipient --> ComposeMessage[Compose Message]
            ComposeMessage --> SelectType[Select Type: SMS/Email/Push/In-App]
            SelectType --> SendSingle[Send]

            SendNotif --> BulkSend[Bulk Notification]
            BulkSend --> SelectRecipients[Select Multiple Recipients]
            SelectRecipients --> FilterBy[Filter by Role/Area/Status]
            FilterBy --> ComposeMsg[Compose Message]
            ComposeMsg --> SelectTypes[Select Types]
            SelectTypes --> SendBulk[Send to All]

            SendNotif --> TestNotif[Test Notification]
            TestNotif --> EnterTestRecipient[Enter Test Recipient]
            EnterTestRecipient --> SelectChannel[Select Channel]
            SelectChannel --> SendTest[Send Test]
            SendTest --> VerifyDelivery[Verify Delivery]
        end

        subgraph AutoNotif["Automated Notifications"]
            Triggers([System Triggers]) --> VisitReminder[Visit Reminder]
            Triggers --> SOSAlert[SOS Alert Notification]
            Triggers --> StatusChange[Status Change Notification]
            Triggers --> WelcomeEmail[Welcome Email]
            Triggers --> PasswordReset[Password Reset]
        end
    end
```

---

## Part 2: Role-wise Workflows

### 2.1 Super Admin Workflow

```mermaid
flowchart TD
    subgraph SuperAdmin["Super Admin - Complete System Access"]
        Login([Login as Super Admin]) --> Dashboard[System Dashboard]

        Dashboard --> UserMgmt[User Management]
        UserMgmt --> CreateUsers[Create Any User Type]
        UserMgmt --> ManageRoles[Manage Roles and Permissions]
        UserMgmt --> DeactivateUsers[Deactivate/Delete Users]

        Dashboard --> SystemConfig[System Configuration]
        SystemConfig --> GlobalSettings[Global Settings]
        SystemConfig --> IntegrationConfig[API Integrations]
        SystemConfig --> SecurityConfig[Security Settings]

        Dashboard --> MasterData[Master Data]
        MasterData --> ManageHierarchy[Full Hierarchy Control]
        MasterData --> ManageLookups[Manage All Lookups]
        MasterData --> BulkImport[Bulk Import/Export]

        Dashboard --> AuditLogs[Audit Logs]
        AuditLogs --> ViewAllLogs[View All System Logs]
        AuditLogs --> ExportLogs[Export Audit Trails]

        Dashboard --> AllReports[All Reports]
        AllReports --> SystemWide[System-wide Analytics]
        AllReports --> CrossDistrict[Cross-District Reports]

        Dashboard --> DataMgmt[Data Management]
        DataMgmt --> BulkCitizen[Bulk Citizen Operations]
        DataMgmt --> DataCleanup[Data Cleanup Tools]
        DataMgmt --> BackupRestore[Backup/Restore]
    end
```

### 2.2 Admin Workflow

```mermaid
flowchart TD
    subgraph Admin["Admin - District/Station Level Management"]
        Login([Login as Admin]) --> Dashboard[Admin Dashboard]

        Dashboard --> CitizenMgmt[Citizen Management]
        CitizenMgmt --> ViewCitizens[View All Citizens in Jurisdiction]
        CitizenMgmt --> CreateCitizen[Create New Citizens]
        CitizenMgmt --> EditCitizen[Edit Citizen Details]
        CitizenMgmt --> VerifyCitizen[Verify Registrations]

        Dashboard --> OfficerMgmt[Officer Management]
        OfficerMgmt --> ViewOfficers[View Officers]
        OfficerMgmt --> CreateOfficer[Create Officers]
        OfficerMgmt --> TransferOfficer[Transfer Officers]
        OfficerMgmt --> AssignBeats[Assign to Beats]

        Dashboard --> VisitMgmt[Visit Management]
        VisitMgmt --> ViewAll[View All Visits]
        VisitMgmt --> Schedule[Schedule Visits]
        VisitMgmt --> AutoSchedule[Auto-Schedule]
        VisitMgmt --> ManageCalendar[Manage Calendar]

        Dashboard --> SOSMgmt[SOS Management]
        SOSMgmt --> MonitorAlerts[Monitor Active Alerts]
        SOSMgmt --> RespondAlerts[Respond to Alerts]
        SOSMgmt --> ResolveAlerts[Resolve Alerts]

        Dashboard --> Reports[Reports and Analytics]
        Reports --> DashboardStats[View Dashboard]
        Reports --> GenerateReports[Generate Reports]
        Reports --> ExportData[Export Data]

        Dashboard --> Settings[Station Settings]
        Settings --> LocalConfig[Local Configuration]
        Settings --> NotifSettings[Notification Settings]
    end
```

### 2.3 Officer Workflow

```mermaid
flowchart TD
    subgraph Officer["Field Officer - Beat Level Operations"]
        Login([Login as Officer]) --> Dashboard[Officer Dashboard]

        Dashboard --> MyAssignments[My Assignments]
        MyAssignments --> TodayVisits[Todays Visits]
        MyAssignments --> PendingVisits[Pending Visits]
        MyAssignments --> OverdueVisits[Overdue Visits]

        TodayVisits --> SelectVisit[Select Visit]
        SelectVisit --> StartVisit[Start Visit]
        StartVisit --> GPS[Capture GPS Location]
        GPS --> VisitCitizen[Visit Citizen Home]
        VisitCitizen --> FillAssessment[Fill Assessment Form]
        FillAssessment --> TakePhoto[Take Photo Evidence]
        TakePhoto --> AddNotes[Add Observations]
        AddNotes --> SubmitCompletion[Complete Visit]
        SubmitCompletion --> Dashboard

        Dashboard --> MyCitizens[My Beat Citizens]
        MyCitizens --> ViewProfiles[View Profiles]
        MyCitizens --> ViewHistory[View Visit History]
        MyCitizens --> CallCitizen[Quick Call]

        Dashboard --> SOSRespond[SOS Response]
        SOSRespond --> ReceiveAlert[Receive Alert Notification]
        ReceiveAlert --> ViewLocation[View Alert Location]
        ViewLocation --> NavigateTo[Navigate to Location]
        NavigateTo --> RespondOnSite[Respond On-Site]
        RespondOnSite --> UpdateStatus[Update Alert Status]

        Dashboard --> MyReports[My Reports]
        MyReports --> VisitStats[My Visit Statistics]
        MyReports --> PerfMetrics[Performance Metrics]
        MyReports --> ExportMy[Export My Data]
    end
```

### 2.4 Supervisor Workflow

```mermaid
flowchart TD
    subgraph Supervisor["Supervisor - Team Oversight"]
        Login([Login as Supervisor]) --> Dashboard[Supervisor Dashboard]

        Dashboard --> TeamOverview[Team Overview]
        TeamOverview --> OfficerList[View My Officers]
        OfficerList --> OfficerPerformance[View Performance]
        OfficerList --> Workload[View Workload]

        Dashboard --> VisitMgmt[Visit Management]
        VisitMgmt --> AllTeamVisits[View Team Visits]
        VisitMgmt --> ScheduleVisits[Schedule for Team]
        VisitMgmt --> ReassignVisits[Reassign Visits]
        VisitMgmt --> ApproveCompletions[Review Completions]

        Dashboard --> CitizenReview[Citizen Review]
        CitizenReview --> ViewCitizens[View Jurisdiction Citizens]
        CitizenReview --> CreateCitizen[Register New Citizens]
        CitizenReview --> UpdateRecords[Update Records]

        Dashboard --> SOSSupervision[SOS Supervision]
        SOSSupervision --> MonitorAlerts[Monitor Active Alerts]
        SOSSupervision --> TrackResponses[Track Officer Responses]
        SOSSupervision --> EscalateAlerts[Escalate if Needed]
        SOSSupervision --> ResolveAlerts[Resolve Alerts]

        Dashboard --> Reporting[Team Reports]
        Reporting --> TeamStats[Team Statistics]
        Reporting --> CompareOfficers[Compare Performance]
        Reporting --> GenerateReports[Generate Team Reports]
    end
```

### 2.5 Citizen Self-Service Workflow

```mermaid
flowchart TD
    subgraph Citizen["Senior Citizen - Self-Service Portal"]
        Start([Citizen Access]) --> AuthChoice{Has Account?}

        AuthChoice -->|No| Register[Register]
        Register --> EnterPhone[Enter Phone/Aadhaar]
        EnterPhone --> VerifyOTP[Verify OTP]
        VerifyOTP --> CreateProfile[Complete Profile]
        CreateProfile --> Dashboard

        AuthChoice -->|Yes| Login[Login with OTP]
        Login --> Dashboard[My Dashboard]

        Dashboard --> MyProfile[My Profile]
        MyProfile --> ViewProfile[View Details]
        MyProfile --> UpdateContact[Update Contact Info]
        MyProfile --> UpdateEmergency[Update Emergency Contacts]
        MyProfile --> UpdateHealth[Update Health Info]

        Dashboard --> MyVisits[My Visits]
        MyVisits --> UpcomingVisits[View Upcoming Visits]
        MyVisits --> PastVisits[View Past Visits]
        MyVisits --> RequestVisit[Request Special Visit]
        RequestVisit --> SelectReason[Select Reason]
        SelectReason --> SubmitRequest[Submit Request]

        Dashboard --> Documents[My Documents]
        Documents --> ViewDocs[View Documents]
        Documents --> UploadDocs[Upload Documents]
        Documents --> DigitalCard[View Digital ID Card]

        Dashboard --> SOSButton[SOS Emergency]
        SOSButton --> PressPanic[Press Panic Button]
        PressPanic --> ConfirmSOS{Confirm Emergency?}
        ConfirmSOS -->|Yes| SendSOS[Send SOS Alert]
        SendSOS --> TrackResponse[Track Response]
        TrackResponse --> ViewStatus[View Alert Status]
        ConfirmSOS -->|No| Dashboard

        Dashboard --> Feedback[Give Feedback]
        Feedback --> RateVisit[Rate Last Visit]
        Feedback --> SubmitComplaint[Submit Complaint]
        Feedback --> Suggestions[Provide Suggestions]

        Dashboard --> Notifications[Notifications]
        Notifications --> ViewNotifs[View All]
        Notifications --> ManagePrefs[Notification Preferences]
    end
```

### 2.6 Control Room Workflow

```mermaid
flowchart TD
    subgraph ControlRoom["Control Room - Emergency Monitoring"]
        Login([Login as Control Room]) --> Dashboard[Real-time Dashboard]

        Dashboard --> LiveMap[Live SOS Map]
        LiveMap --> ActiveAlerts[Active Alerts]
        ActiveAlerts --> Alert1[Alert Details]
        Alert1 --> CitizenInfo[Citizen Information]
        Alert1 --> LocationTrail[Location History]
        Alert1 --> NearbyOfficers[Nearby Officers]

        ActiveAlerts --> Action{Take Action}
        Action -->|Assign| AssignOfficer[Assign Officer]
        AssignOfficer --> NotifyOfficer[Send Notification]
        NotifyOfficer --> TrackProgress[Track Progress]

        Action -->|Escalate| Escalate[Escalate Alert]
        Escalate --> NotifyAdmin[Notify Admin/Supervisor]
        Escalate --> AddPriority[Increase Priority]

        Action -->|Resolve| ResolveAlert[Resolve Alert]
        ResolveAlert --> AddResolution[Add Resolution Notes]
        AddResolution --> CloseAlert[Close Alert]

        Dashboard --> QuickView[Quick Views]
        QuickView --> AllOfficers[View All Officers]
        QuickView --> AllCitizens[Search Citizens]
        QuickView --> VisitStatus[Current Visits Status]

        Dashboard --> Statistics[Real-time Stats]
        Statistics --> ResponseTimes[Response Times]
        Statistics --> AlertCounts[Alert Counts]
        Statistics --> OfficerAvailability[Officer Availability]
    end
```

### 2.7 Data Entry Operator Workflow

```mermaid
flowchart TD
    subgraph DataEntry["Data Entry Operator - Registration Focus"]
        Login([Login as Data Entry]) --> Dashboard[Data Entry Dashboard]

        Dashboard --> CitizenReg[Citizen Registration]
        CitizenReg --> NewRegistration[New Registration]
        NewRegistration --> EnterBasicInfo[Enter Basic Info]
        EnterBasicInfo --> EnterAddress[Enter Address Details]
        EnterAddress --> EnterHealth[Enter Health Details]
        EnterHealth --> EnterEmergency[Emergency Contacts]
        EnterEmergency --> CheckDuplicate[Check Duplicates]
        CheckDuplicate --> SaveCitizen[Save Record]

        Dashboard --> DocumentMgmt[Document Management]
        DocumentMgmt --> UploadPhoto[Upload Photo]
        DocumentMgmt --> UploadID[Upload ID Proof]
        DocumentMgmt --> UploadAddress[Upload Address Proof]
        DocumentMgmt --> UploadMedical[Upload Medical Docs]

        Dashboard --> BulkEntry[Bulk Operations]
        BulkEntry --> DownloadTemplate[Download CSV Template]
        BulkEntry --> PrepareData[Prepare Data]
        BulkEntry --> UploadCSV[Upload CSV]
        BulkEntry --> ValidateData[Validate Records]
        BulkEntry --> ImportRecords[Import Records]

        Dashboard --> DataCorrection[Data Correction]
        DataCorrection --> SearchCitizen[Search Citizen]
        DataCorrection --> UpdateDetails[Update Details]
        DataCorrection --> FixErrors[Fix Data Errors]

        Dashboard --> ExportData[Export Data]
        ExportData --> SelectFilters[Apply Filters]
        ExportData --> GenerateExport[Generate Export]
        ExportData --> DownloadFile[Download File]
    end
```

### 2.8 Viewer Workflow

```mermaid
flowchart TD
    subgraph Viewer["Viewer - Read-Only Access"]
        Login([Login as Viewer]) --> Dashboard[View Dashboard]

        Dashboard --> ViewCitizens[View Citizens]
        ViewCitizens --> BrowseList[Browse List]
        ViewCitizens --> SearchCitizen[Search]
        ViewCitizens --> ViewProfile[View Profile]
        ViewCitizens --> Note1[Cannot Edit]

        Dashboard --> ViewOfficers[View Officers]
        ViewOfficers --> OfficerList[Officer List]
        ViewOfficers --> OfficerDetails[Officer Details]
        ViewOfficers --> Note2[Cannot Edit]

        Dashboard --> ViewVisits[View Visits]
        ViewVisits --> VisitCalendar[View Calendar]
        ViewVisits --> VisitList[View List]
        ViewVisits --> VisitDetails[View Details]
        ViewVisits --> Note3[Cannot Schedule]

        Dashboard --> ViewReports[View Reports]
        ViewReports --> DashboardStats[Dashboard Statistics]
        ViewReports --> Demographics[Demographics]
        ViewReports --> Analytics[Analytics Charts]
        ViewReports --> Note4[Cannot Export]
    end
```

---

## Part 3: Cross-Module Integration Flows

### 3.1 End-to-End Citizen Lifecycle

```mermaid
flowchart TD
    subgraph CitizenLifecycle["Complete Citizen Lifecycle"]
        Registration([Citizen Registration]) --> DataEntry[Data Entry Creates Record]
        DataEntry --> DocUpload[Documents Uploaded]
        DocUpload --> Verification[Admin Verifies Record]
        Verification --> Approved{Approved?}
        Approved -->|No| Rejected[Send for Correction]
        Rejected --> DataEntry
        Approved -->|Yes| BeatAssigned[Assigned to Beat]
        BeatAssigned --> OfficerAssigned[Officer Assigned]
        OfficerAssigned --> FirstVisit[First Visit Scheduled]
        FirstVisit --> VisitCompleted[Visit Completed]
        VisitCompleted --> RiskAssessed[Risk Level Assessed]
        RiskAssessed --> FollowUp{High Risk?}
        FollowUp -->|Yes| FrequentVisits[More Frequent Visits]
        FollowUp -->|No| RegularVisits[Regular Visit Schedule]

        FrequentVisits --> OngoingCare[Ongoing Care]
        RegularVisits --> OngoingCare

        OngoingCare --> SOSEvent{SOS Event?}
        SOSEvent -->|Yes| Emergency[Emergency Response]
        Emergency --> Resolved[Issue Resolved]
        Resolved --> OngoingCare
        SOSEvent -->|No| StatusChange{Status Change?}
        StatusChange -->|Yes| UpdateRecord[Update Record]
        UpdateRecord --> OngoingCare
        StatusChange -->|No| Continue[Continue Care]
        Continue --> OngoingCare
    end
```

### 3.2 Daily Operations Flow

```mermaid
flowchart TD
    subgraph DailyOps["Daily Operations Flow"]
        Morning([Morning Start]) --> ControlRoom[Control Room Opens]
        ControlRoom --> MonitorDashboard[Monitor Real-time Dashboard]

        Morning --> Officers[Officers Start Day]
        Officers --> ViewAssignments[Check Day Assignments]
        ViewAssignments --> PlanRoute[Plan Visit Route]
        PlanRoute --> StartVisits[Begin Visits]

        StartVisits --> Visit1[Visit Citizen 1]
        Visit1 --> CompleteAssessment[Complete Assessment]
        CompleteAssessment --> NextVisit{More Visits?}
        NextVisit -->|Yes| VisitN[Visit Next Citizen]
        VisitN --> CompleteAssessment
        NextVisit -->|No| EndDay[End of Day]

        MonitorDashboard --> IncomingSOS{SOS Alert?}
        IncomingSOS -->|Yes| AlertOfficer[Alert Nearest Officer]
        AlertOfficer --> OfficerResponds[Officer Responds]
        OfficerResponds --> ResolveEmergency[Resolve Emergency]
        ResolveEmergency --> ResumeVisits[Resume Visits]
        ResumeVisits --> StartVisits
        IncomingSOS -->|No| ContinueMonitor[Continue Monitoring]
        ContinueMonitor --> MonitorDashboard

        EndDay --> SubmitReports[Submit Day Reports]
        SubmitReports --> SupervisorReview[Supervisor Reviews]
        SupervisorReview --> GenerateStats[Generate Daily Stats]
        GenerateStats --> EndOperations([Day Complete])
    end
```

---

## Summary Table: Role Permissions

| Module | Super Admin | Admin | Supervisor | Officer | Citizen | Viewer | Control Room | Data Entry |
|--------|-------------|-------|------------|---------|---------|--------|--------------|------------|
| **Citizens** | Full CRUD | Full CRUD | Read + Write | Read Only | Own Profile | Read | Read | Read + Write |
| **Officers** | Full CRUD | Full CRUD | Read | - | - | Read | Read | - |
| **Visits** | Full CRUD | Full CRUD | Schedule + Complete | Complete Own | Read Own | Read | Read | - |
| **SOS** | Full Access | Full Access | Respond + Resolve | Respond | Create Own | - | Full Access | - |
| **Reports** | All Reports | All Reports | Team Reports | Own Reports | - | View Only | - | Export |
| **System** | Full Config | Local Config | - | - | - | - | - | - |
| **Audit Logs** | Full Access | Full Access | - | - | - | - | - | - |
