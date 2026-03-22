/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Users, LogOut, MessageCircle, Share2, Award, 
  BookOpen, Heart, BarChart3, CheckCircle2, Target, Flag, 
  Calendar, ShieldCheck, UserCheck, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Supabase Mock (오류 방지용) ---
const supabase: any = {
  from: () => ({
    insert: async () => ({ error: null }),
  }),
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: (cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => {},
  }
};

// --- Components ---

const Navbar = ({ user, onLogout, isAdminUser, onAdminClick }: any) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: '협회소개', href: '#협회소개' },
    { name: '인사말', href: '#인사말' },
    { name: '상담신청', href: '#상담신청' },
    { name: '교육과정', href: '#교육과정' },
    { name: '게시판', href: '#게시판' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-black/95 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* 좌측 상단 협회 로고 */}
        <a href="/" className="flex items-center">
          <div className="bg-white p-1 rounded-sm shadow-sm">
             <img 
              src="/logo.png" 
              alt="한국심리상담지도협회 로고" 
              className="h-10 md:h-12 w-auto object-contain" 
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/180x50?text=KPCGA+LOGO';
              }}
            />
          </div>
        </a>

        {/* 중앙 메뉴 및 우측 버튼 섹션 */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-6 lg:gap-8 mr-4">
            {menuItems.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-medium text-gray-300 hover:text-brand-purple transition-colors whitespace-nowrap">{item.name}</a>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={onLogout} className="text-xs text-gray-400 flex items-center gap-2 hover:text-white transition-colors mr-2"><LogOut size={14}/>로그아웃</button>
            ) : (
              <button className="text-sm text-white bg-brand-purple px-5 py-2 rounded-full font-bold hover:brightness-110 transition-all shadow-lg shadow-purple-500/20 whitespace-nowrap">로그인</button>
            )}
            
            {/* 관리자 버튼 (로그인 버튼 옆에 추가) */}
            <button 
              onClick={onAdminClick} 
              className="text-sm text-white purple-gradient px-5 py-2 rounded-full font-bold hover:brightness-110 transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 whitespace-nowrap"
            >
              <Shield size={14} />
              관리자
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="relative h-[85vh] flex items-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000')" }}>
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-0" />
    <div className="container mx-auto px-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-5xl md:text-8xl font-bold text-white leading-tight mb-8">마음의 평온을 찾는<br/><span className="text-brand-purple">새로운 시작</span></h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl font-light leading-relaxed">한국심리상담지도협회는 전문적인 상담과 체계적인 교육을 통해 당신의 삶에 따뜻한 변화를 선물합니다.</p>
        <div className="flex flex-wrap gap-5">
          <a href="#상담신청" className="px-10 py-5 bg-brand-purple text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform text-lg">지금 상담 신청하기</a>
          <a href="#교육과정" className="px-10 py-5 glass-effect text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-lg border border-white/20">프로그램 보기</a>
        </div>
      </motion.div>
    </div>
  </section>
);

const GreetingsSection = () => (
  <section id="인사말" className="py-24 bg-brand-black relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-brand-purple font-bold tracking-widest uppercase mb-4 block">President's Message</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 leading-tight">회원 여러분의 풍부한 경험과<br/>전문지식을 결집하여</h2>
          
          <div className="space-y-8 text-gray-300 leading-relaxed text-lg md:text-xl text-left glass-effect p-10 md:p-16 rounded-[40px] border border-white/5 shadow-2xl">
            <p>한국심리상담지도협회 홈페이지 방문을 진심으로 환영합니다. 협회장입니다.</p>
            <p>우리 협회는 21세기 급변하는 사회 속에서 현대인들이 겪는 다양한 심리적 고통을 분담하고, 전문적인 상담 지도를 통해 건강한 사회를 구현하기 위해 설립되었습니다.</p>
            <p>현재 1,000여 명의 상담 전문가들과 함께 지식과 열정을 결집하여, 상담학의 거목으로서 자리매김하고 있습니다. 우리는 단순한 상담을 넘어 개개인의 내면을 치유하고 삶의 가치를 회복하는 파트너가 되고자 합니다.</p>
            <p>여러분의 발걸음이 헛되지 않도록 최선의 서비스와 전문성을 약속드립니다. 감사합니다.</p>
            
            <div className="pt-10 border-t border-white/10 text-right">
              <p className="text-white font-bold text-2xl tracking-tighter">한국심리상담지도협회 협회장</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />
  </section>
);

const AboutAssociation = () => (
  <section id="협회소개" className="py-24 bg-brand-black">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">협회소개</h2>
        <div className="w-20 h-1.5 bg-brand-purple mx-auto rounded-full" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Target, title: "협회 미션", desc: "전문 상담 지도자 양성을 통해 국민의 심리적 건강 증진과 행복한 삶을 구현합니다." },
          { icon: Flag, title: "협회 비전", desc: "글로벌 표준의 상담 교육 시스템을 구축하여 아시아 최고의 심리상담 지도 기관으로 도약합니다." },
          { icon: ShieldCheck, title: "핵심 가치", desc: "윤리적 전문성, 공감과 포용, 지속적인 연구 개발을 통해 신뢰받는 상담 문화를 선도합니다." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="p-10 rounded-[40px] glass-effect border border-white/5 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-brand-purple/10 flex items-center justify-center mx-auto mb-8 border border-brand-purple/20 text-brand-purple">
              <item.icon size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HistorySection = () => (
  <section id="연혁" className="py-24 bg-brand-black">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">협회 연혁</h2>
        <p className="text-gray-400">한국심리상담지도협회가 걸어온 도전과 열정의 발자취입니다.</p>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
        
        {[
          { year: "2024", title: "협회 회원 1,000명 돌파", desc: "전국 규모의 상담 지도자 네트워크 구축 및 온라인 상담 플랫폼 강화" },
          { year: "2021", title: "META-상담 기법 도입", desc: "메타인지 기반의 상담 교육 커리큘럼 개발 및 정부 우수 교육기관 선정" },
          { year: "2018", title: "국제 심리 심포지엄 개최", desc: "아시아 5개국 전문가 참여 심리 상담 트렌드 및 기법 연구 공유" },
          { year: "2015", title: "전문 지도자 자격 연수 개시", desc: "체계적인 심리상담사 및 지도자 양성 과정 정식 승인 및 시행" },
          { year: "2012", title: "한국심리상담지도협회 설립", desc: "심리 상담의 전문화와 대중화를 기치로 공식 출범" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row gap-8 mb-16 relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-purple border-4 border-brand-black z-10" />
            <div className="md:w-1/2">
              <div className={`p-8 rounded-[32px] glass-effect border border-white/5 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                <span className="text-3xl font-bold text-brand-purple mb-2 block">{item.year}</span>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const IntegratedServiceSection = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', category: '개인 심리 상담', content: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('consultations').insert([formData]);
    if (!error) {
      setSubmitted(true);
      setFormData({ name: '', phone: '', category: '개인 심리 상담', content: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const programs = [
    { title: '개인 심리 상담', icon: Users, color: 'bg-purple-500', desc: '내면의 성장을 돕는 일대일 맞춤형 상담입니다.' },
    { title: '부부 및 가족 상담', icon: Heart, color: 'bg-pink-500', desc: '가족 간의 의사소통을 개선하고 관계를 회복합니다.' },
    { title: '청소년 상담', icon: BookOpen, color: 'bg-emerald-500', desc: '학업 스트레스와 사춘기 고민을 함께 나눕니다.' },
    { title: 'META-상담', icon: BarChart3, color: 'bg-blue-500', desc: '메타인지 기반의 접근을 통해 사고를 객관화합니다.' },
    { title: '드론 우울 상담', icon: Share2, color: 'bg-orange-500', desc: '첨단 기술과 상담을 결합한 혁신적인 치유입니다.' },
    { title: 'K5(KTDRI)상담', icon: Award, color: 'bg-indigo-500', desc: '표준화된 검사로 성향을 과학적으로 분석합니다.' },
  ];

  return (
    <section id="상담신청" className="py-24 bg-brand-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">맞춤형 심리 솔루션 & 상담 신청</h2>
          <p className="text-gray-400">당신에게 가장 적합한 프로그램을 확인하고 그 자리에서 바로 신청하실 수 있습니다.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {programs.map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-[32px] glass-effect border border-white/5 hover:border-brand-purple/40 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">{item.desc}</p>
                <button className="text-sm text-brand-purple font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">상세보기 <ChevronRight size={16}/></button>
              </motion.div>
            ))}
          </div>

          <div className="sticky top-28 glass-effect rounded-[40px] p-8 md:p-12 border border-white/10 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 purple-gradient"></div>
            <h3 className="text-2xl font-bold text-white mb-2 text-center">빠른 상담 신청</h3>
            <p className="text-sm text-gray-500 text-center mb-10">내용을 작성해 주시면 전문가가 직접 연락드립니다.</p>
            
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle2 className="text-green-500 mx-auto mb-6" size={50} />
                <h4 className="text-white font-bold text-xl mb-2">신청이 완료되었습니다!</h4>
                <p className="text-gray-400">빠른 시일 내에 연락드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="성함" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-brand-purple" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="tel" placeholder="연락처" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-brand-purple" onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <select className="w-full bg-brand-dark-gray border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-brand-purple appearance-none cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>개인 심리 상담</option>
                  <option>부부 및 가족 상담</option>
                  <option>청소년 상담</option>
                  <option>META-상담</option>
                  <option>드론 우울 상담</option>
                  <option>K5(KTDRI)상담</option>
                </select>
                <textarea placeholder="상담 문의 내용" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white h-36 outline-none focus:border-brand-purple resize-none" onChange={e => setFormData({...formData, content: e.target.value})} />
                <div className="flex items-center gap-3 ml-1">
                  <input type="checkbox" id="agree" required className="w-5 h-5 rounded border-white/10 bg-white/5 text-brand-purple focus:ring-brand-purple cursor-pointer" />
                  <label htmlFor="agree" className="text-sm text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">개인정보 수집 및 이용 동의</label>
                </div>
                <button className="w-full py-5 purple-gradient text-white font-bold rounded-2xl shadow-xl hover:opacity-90 transition-all hover:scale-[1.01] text-lg">상담 신청하기</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-brand-black py-20 border-t border-white/5 text-center">
    <div className="container mx-auto px-6">
      <div className="bg-white inline-block p-1 rounded-sm mb-6">
        <img src="/logo.png" alt="협회 로고" className="h-10 mx-auto opacity-100 transition-opacity" 
          onError={(e) => e.currentTarget.style.display = 'none'} />
      </div>
      <div className="flex justify-center flex-wrap gap-8 mb-10 text-gray-500 text-sm">
        <a href="#협회소개" className="hover:text-brand-purple transition-colors">협회소개</a>
        <a href="#인사말" className="hover:text-brand-purple transition-colors">인사말</a>
        <a href="#연혁" className="hover:text-brand-purple transition-colors">연혁</a>
        <a href="#상담신청" className="hover:text-brand-purple transition-colors">상담신청</a>
        <a href="#" className="hover:text-brand-purple transition-colors">개인정보처리방침</a>
      </div>
      <p className="text-gray-600 text-xs mb-3 tracking-widest uppercase font-medium">Korea Psychological Counseling Association</p>
      <p className="text-gray-600 text-xs">© 2026 한국심리상담지도협회. All rights reserved.</p>
    </div>
  </footer>
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-purple/30 scroll-smooth">
      <Navbar 
        user={user} 
        onLogout={() => supabase.auth.signOut()} 
        isAdminUser={true} // 시연을 위해 관리자 권한을 상시 활성화
        onAdminClick={() => setIsAdmin(true)}
      />
      <main>
        <Hero />
        <AboutAssociation />
        <GreetingsSection />
        <HistorySection />
        <IntegratedServiceSection />
      </main>
      <Footer />

      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full purple-gradient text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40">
        <MessageCircle size={30} />
      </button>
    </div>
  );
}
