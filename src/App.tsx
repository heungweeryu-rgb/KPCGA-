import React, { useState } from 'react';
import { 
  Users, 
  History, 
  Info, 
  MessageCircle, 
  Calendar, 
  LayoutDashboard, 
  ChevronRight, 
  Menu,
  X,
  PlusCircle,
  LogOut
} from 'lucide-react';

// --- 전역 데이터 (협회 정보) ---
const ASSOCIATION_INFO = {
  about: "한국심리상담지도협회는 전문적인 상담과 체계적인 교육을 통해 당신의 삶에 따뜻한 변화를 선물합니다. 우리는 1,900여 명의 회원과 전문인력을 보유한 심리상담 전문가 단체로 발전하였습니다.",
  greeting: "2007년 3월 실무이사 7명, 심리상담 전공교수 15명 등 22명이 발기인대회를 갖고 창립총회를 연 것이 엊그제 같은데 이제는 당당한 전문가 그룹으로 성장했습니다. 회원 여러분께 심심한 존경과 감사의 말씀을 드립니다.",
  history: [
    { year: "2024", event: "청소년상담심리학회 및 한국청소년보호연맹 전략적 제휴" },
    { year: "2014", event: "연구 성과물 교류 협력 및 심리상담 전문가 양성 과정 개설" },
    { year: "2007", event: "한국심리상담지도협회 창립총회 및 발기인대회" }
  ]
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  // 네비게이션 컴포넌트
  const Navbar = () => (
    <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="bg-purple-600 p-2 rounded-lg">
            <Users size={20} />
          </div>
          <span className="font-bold text-lg">한국심리상담지도협회</span>
        </div>
        
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <button onClick={() => setCurrentPage('about')} className="hover:text-purple-400">협회소개</button>
          <button onClick={() => setCurrentPage('greeting')} className="hover:text-purple-400">인사말</button>
          <button onClick={() => setCurrentPage('history')} className="hover:text-purple-400">연혁</button>
          <button onClick={() => setCurrentPage('program')} className="hover:text-purple-400">상담프로그램</button>
          <button onClick={() => setCurrentPage('board')} className="hover:text-purple-400">게시판</button>
        </div>

        <div className="flex gap-2">
          {!isAdmin ? (
            <button 
              onClick={() => setIsAdmin(true)} 
              className="bg-purple-600 px-4 py-2 rounded-full text-xs hover:bg-purple-700 transition"
            >
              관리자 로그인
            </button>
          ) : (
            <button 
              onClick={() => setIsAdmin(false)} 
              className="bg-gray-700 px-4 py-2 rounded-full text-xs flex items-center gap-1"
            >
              <LogOut size={14} /> 로그아웃
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  // --- 페이지 컴포넌트들 ---

  const HomePage = () => (
    <div className="relative">
      <div className="h-[600px] bg-cover bg-center flex items-center text-white relative" 
           style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80')` }}>
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            회원여러분의 풍부한 경험과<br/>
            <span className="text-purple-400">전문지식을 결집하여</span>
          </h1>
          <p className="max-w-2xl text-lg text-gray-300 mb-8 leading-relaxed">
            {ASSOCIATION_INFO.about}
          </p>
          <div className="flex gap-4">
            <button className="bg-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-700">지금 상담 신청하기</button>
            <button onClick={() => setCurrentPage('program')} className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition">프로그램 보기</button>
          </div>
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h2 className="text-3xl font-bold mb-10 border-l-4 border-purple-600 pl-4">협회소개</h2>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-gray-700 leading-loose mb-6">{ASSOCIATION_INFO.about}</p>
          <div className="bg-purple-50 p-6 rounded-2xl">
            <h4 className="font-bold text-purple-900 mb-2">비전 및 미션</h4>
            <p className="text-sm text-purple-800 italic">"전문성과 현장성이 결집된 실용적 기법을 통해 사회적 가치를 실현합니다."</p>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
          <p className="text-gray-400 text-sm">협회 전경 또는 단체 사진 자리</p>
        </div>
      </div>
    </div>
  );

  const GreetingPage = () => (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h2 className="text-3xl font-bold mb-10 border-l-4 border-purple-600 pl-4">인사말</h2>
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-xl font-medium text-gray-800 mb-8 leading-relaxed">"{ASSOCIATION_INFO.greeting}"</p>
        <div className="border-t pt-8 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm italic">사단법인 한국심리상담지도협회</p>
            <p className="text-lg font-bold mt-1">대표이사 배상</p>
          </div>
        </div>
      </div>
    </div>
  );

  const HistoryPage = () => (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h2 className="text-3xl font-bold mb-10 border-l-4 border-purple-600 pl-4">연혁</h2>
      <div className="relative border-l-2 border-gray-200 ml-4 space-y-12 pb-12">
        {ASSOCIATION_INFO.history.map((item, index) => (
          <div key={index} className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-600 border-4 border-white"></div>
            <span className="text-purple-600 font-bold text-lg">{item.year}</span>
            <p className="text-gray-800 text-lg font-medium mt-1">{item.event}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const AdminPanel = () => (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-purple-600" /> 관리자 대시보드
          </h2>
          <p className="text-gray-500 mt-2">대시보드 홈 - 빠른 데이터 입력 및 현황 관리</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium">
          Low on credits - 120 credits remaining
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <QuickAction title="공지사항 작성" desc="새로운 소식을 게시합니다." icon={<PlusCircle />} color="bg-blue-600" />
        <QuickAction title="사진 업로드" desc="갤러리 이미지를 추가합니다." icon={<PlusCircle />} color="bg-green-600" />
        <QuickAction title="상담 내역 등록" desc="수동으로 상담 내역을 기록합니다." icon={<PlusCircle />} color="bg-purple-600" />
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-4">최근 상담 신청 현황</h3>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">회</div>
                <div>
                  <p className="font-bold">상담 예약 신청 - 김OO 님</p>
                  <p className="text-sm text-gray-500">2024-03-22 14:30</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, desc, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group cursor-pointer">
      <div className={`${color} text-white w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h4 className="font-bold text-lg group-hover:text-purple-600">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {!isAdmin ? (
        <>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'greeting' && <GreetingPage />}
          {currentPage === 'history' && <HistoryPage />}
          {(currentPage === 'program' || currentPage === 'board') && (
            <div className="py-40 text-center text-gray-400">준비 중인 페이지입니다.</div>
          )}
        </>
      ) : (
        <AdminPanel />
      )}

      {/* 푸터 */}
      <footer className="bg-slate-900 text-gray-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="bg-purple-600 p-1.5 rounded">
                <Users size={16} />
              </div>
              <span className="font-bold">한국심리상담지도협회</span>
            </div>
            <p className="text-sm max-w-sm leading-relaxed">
              본 협회는 심리상담의 전문화와 대중화를 위해 끊임없이 연구하고 실천합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <h5 className="text-white font-bold mb-4">주요메뉴</h5>
              <ul className="text-sm space-y-2">
                <li>협회소개</li>
                <li>프로그램 안내</li>
                <li>학술연구</li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">고객지원</h5>
              <ul className="text-sm space-y-2">
                <li>공지사항</li>
                <li>상담예약</li>
                <li>오시는 길</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-xs text-center">
          © 2024 한국심리상담지도협회. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
