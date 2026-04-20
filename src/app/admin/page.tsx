import { redirect } from 'next/navigation';

export default function AdminPage() {
    // /admin 접속 시 자동으로 대시보드로 리다이렉트 (미들웨어가 로그인을 먼저 체크함)
    redirect('/admin/dashboard');
}
