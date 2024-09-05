import LoginForm from '../components/LoginForm';
import PasswordReset from '../password/page';
export default function Login() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <LoginForm />
    </div>
  );
}