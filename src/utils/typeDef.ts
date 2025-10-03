export enum VisitPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum VisitType {
    WALK_IN = 'WALK_IN',
    PRE_SCHEDULED = 'PRE_SCHEDULED',
    RECURRING = 'RECURRING'
}

export enum VisitPurpose {
    MEETING = 'MEETING',
    INTERVIEW = 'INTERVIEW',
    DELIVERY = 'DELIVERY',
    CONSULTATION = 'CONSULTATION',
    TRAINING = 'TRAINING',
    MAINTENANCE = 'MAINTENANCE',
    SALES = 'SALES',
    SUPPORT = 'SUPPORT',
    OTHER = 'OTHER'
}

export interface AssignmentFormData {
    employeeId: string;
    visitId: string; // Obligatoire maintenant
    visitPurpose: VisitPurpose;
    priority: VisitPriority;
    visitType: VisitType;
    estimatedDuration?: number;
    notes: string;
}


export const getNotificationColor = (type: string): string => {
    switch (type) {
        case 'VISIT_REQUEST':
            return 'blue';
        case 'VISIT_ACCEPTED':
            return 'green';
        case 'VISIT_REJECTED':
            return 'red';
        case 'VISIT_RESCHEDULED':
            return 'orange';
        case 'VISITOR_ARRIVED':
            return 'cyan';
        case 'VISIT_CANCELLED':
            return 'volcano';
        case 'VISIT_COMPLETED':
            return 'lime';
        default:
            return 'default';
    }
};

export interface ReceptionistFormProps {
    form: any;
    companies: any[];
    loading?: boolean;
}

export interface EmployeeFormProps {
    form: any;
    companies: any[];
    loading?: boolean;
}

export interface UserFilters {
    page: number;
    limit: number;
    role?: string;
    companyId?: string;
    search?: string;
    isActive?: string;
}

export interface NewCompanyProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export interface CompanyFormData {
    name: string;
    address: string;
    email?: string;
    phone?: string;
}

export interface Company {
    _id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    stats?: {
        employees: number;
        receptionists: number;
        pendingApprovals: number;
        totalUsers: number;
    };
}

export interface CompanyFilters {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface UserFilters {
    page: number;
    limit: number;
    role?: string;
    companyId?: string;
    search?: string;
    status?: string;
}

export interface User {
    _id: string;
    email: string;
    role: string; // Directement string, pas d'objet
    companyId?: {
        _id: string;
        name: string;
    };
    isActive: boolean;
    connected: boolean; // Nouveau champ
    lastLogin?: string;
    createdAt: string;
    profileId?: string;
}

export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'PENDING':
            return 'orange';
        case 'ACCEPTED':
            return 'blue';
        case 'REJECTED':
            return 'red';
        case 'CHECKED_IN':
            return 'green';
        case 'CHECKED_OUT':
            return 'gray';
        case 'RESCHEDULED':
            return 'purple';
        case 'NO_SHOW':
            return 'volcano';
        default:
            return 'default';
    }
};

export const getPriorityColor = (priority: string): string => {
    switch (priority) {
        case 'LOW':
            return 'green';
        case 'MEDIUM':
            return 'blue';
        case 'HIGH':
            return 'orange';
        case 'URGENT':
            return 'red';
        default:
            return 'default';
    }
};

export interface VisitTableProps {
    visits: any[];
    onCheckIn?: (visitId: string) => void;
    onCheckOut?: (visitId: string) => void;
    loading?: boolean;
    showActions?: boolean;
}

