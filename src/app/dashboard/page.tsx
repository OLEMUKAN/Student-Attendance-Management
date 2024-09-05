import LogoutButton from '../components/LogoutButton';
import StudentDashboard from '../components/StudentDashboard'

export default function Dashboard() {
    return (
        <div className="container mx-auto p-4">
    <StudentDashboard />
            <LogoutButton />
        </div>
    );
}