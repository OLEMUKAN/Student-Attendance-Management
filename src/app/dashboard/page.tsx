import LogoutButton from '../components/LogoutButton';
import StudentDashboard from '../components/StudentDashboard'

export default function Dashboard() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <StudentDashboard />
            <LogoutButton />
        </div>
    );
}