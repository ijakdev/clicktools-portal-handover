export default function PrivacyPage() {
    return (
        <div className="container max-w-3xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">개인정보 처리방침 (Privacy Policy)</h1>

            <div className="prose prose-slate max-w-none">
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">1. 로컬 처리 원칙</h2>
                    <p className="text-slate-600 mb-4">
                        <strong>PDF Utility</strong>는 사용자의 개인정보와 파일 보안을 최우선으로 생각합니다.
                        우리가 제공하는 모든 주요 변환 기능(JPG to PDF, PDF to JPG 등)은 사용자의 브라우저 내에서만 실행됩니다.
                    </p>
                    <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200">
                        <p className="font-semibold">✨ 귀하의 파일은 서버로 전송되지 않습니다.</p>
                        <p className="text-sm mt-1">
                            모든 연산은 귀하의 디바이스(PC/모바일) 자원을 사용하여 수행됩니다. 인터넷 연결이 끊겨도 작동합니다.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">2. 예외 사항</h2>
                    <p className="text-slate-600 mb-2">
                        다음 기능들은 기술적 한계로 인해 서버 처리가 필요할 수 있습니다 (현재 구현되지 않음):
                    </p>
                    <ul className="list-disc pl-5 text-slate-600 space-y-1">
                        <li>HTML to PDF (웹페이지 렌더링)</li>
                        <li>PDF to Office (복잡한 문서 구조 분석)</li>
                        <li>OCR (광학 문자 인식)</li>
                    </ul>
                    <p className="text-slate-600 mt-2">
                        이러한 기능이 활성화될 경우, 파일 전송 전에 반드시 사용자에게 명시적인 동의를 구합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">3. 쿠키 및 데이터 저장</h2>
                    <p className="text-slate-600">
                        우리는 별도의 회원가입을 요구하지 않으며, 사용자를 식별하기 위한 추적 쿠키를 사용하지 않습니다.
                        사이트 설정(예: 다크모드 등) 저장을 위해 로컬 스토리지(Local Storage)를 사용할 수 있습니다.
                    </p>
                </section>
            </div>
        </div>
    );
}

