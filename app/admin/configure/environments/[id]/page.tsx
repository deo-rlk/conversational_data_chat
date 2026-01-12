import { EnvironmentDetail } from '@/components/admin/environments/EnvironmentDetail';

interface EnvironmentDetailPageProps {
  params: {
    id: string;
  };
}

export default function EnvironmentDetailPage({ params }: EnvironmentDetailPageProps) {
  return <EnvironmentDetail environmentId={params.id} />;
}
