// User management types

export interface AddUserPageProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export type UserFormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  country?: string;
  role?: string;
};

export interface UserListProps {
  onAddUser?: () => void;
}
