import { AddUserForm } from '@/components/admin/environments/AddUserForm';

interface AddUserPageProps {
  params: {
    id: string;
  };
}

export default function AddUserPage({ params }: AddUserPageProps) {
  return <AddUserForm environmentId={params.id} />;
}
