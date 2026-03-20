/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, LayoutDashboard, FileText, Settings, 
  Users, Bell, LogOut, Plus, Edit2, Trash2, Search, 
  Instagram, Facebook, MessageCircle, Share2, Award, 
  BookOpen, Heart, Shield, ArrowUpRight, BarChart3,
  CheckCircle2, Clock, MapPin, Phone, Mail, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';

// --- Types ---
interface Post {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  author: string;
  image?: string;
}

interface PhotoPost {
  id: string;
  title: string;
  image: string;
  date: string;
}

interface SiteSettings {
  siteName: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
}

interface Consultation {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  category: string;
  content: string;
  status: 'pending' | 'completed' | 'canceled';
}

// --- Mock Data ---
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: '현대인의 스트레스 관리와 심리적 회복탄력성',
    category: '심리칼럼',
    content: '스트레스는 피할 수 없는 현대인의 숙명과도 같습니다. 하지만 이를 어떻게 관리하느냐에 따라...',
    date: '2026-03-15',
    author: '김한일 소장',
    image: 'https://images.unsplash.com/photo-1556157382-97dee2dcb748?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: '2026년 상반기 심리상담사 모집 안내',
    category: '공지사항',
    content: '한국심리상담지도협회에서 역량 있는 심리상담사 양성을 위한 자격 과정을 개설합니다.',
    date: '2026-03-10',
    author: '교육팀',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0fe4a2c90b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: '청소년기 자아정체성 확립을 위한 부모의 역할',
    category: '교육정보',
    content: '사춘기 자녀를 둔 부모님들이 가장 많이 고민하시는 부분은 바로 소통입니다.',
    date: '2026-03-05',
    author: '이교육 실장',
    image: 'https://images.unsplash.com/photo-1519085185758-2ad9f1211741?auto=format&fit=crop&q=80&w=800'
  }
];

const INITIAL_PHOTO_POSTS: PhotoPost[] = [
  { id: '1', title: '2026 상반기 정기 세미나 현장', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400', date: '2024-03-15' },
  { id: '2', title: '심리상담사 연찬회', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400', date: '2024-03-14' },
  { id: '3', title: '협회 워크숍 단체 사진', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=400', date: '2024-03-12' },
  { id: '4', title: '미술치료 실습 현장', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400', date: '2024-03-10' },
];

// --- Components ---

const Navbar = ({ 
  onAdminClick, 
  user, 
  onLoginClick, 
  onSignupClick, 
  onLogout,
  isAdminUser
}: { 
  onAdminClick: () => void,
  user: any,
  onLoginClick: () => void,
  onSignupClick: () => void,
  onLogout: () => void,
  isAdminUser: boolean
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-black/80 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <img 
              src="https://images.weserv.nl/?url=kpcga.or.kr/theme/f002/img/logo.png&w=400&h=120&fit=contain" 
              alt="한국심리상담지도협회 Logo" 
              className="h-10 md:h-16 w-auto object-contain"
              onLoad={(e) => {
                // Ensure it's visible if loaded
                e.currentTarget.classList.remove('hidden');
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                if (fallback) fallback.classList.remove('hidden');
              }}
              referrerPolicy="no-referrer"
            />
            <div className="logo-fallback hidden flex items-center gap-2">
              <div className="w-10 h-10 purple-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
                <Heart className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white leading-none">한국심리상담지도협회</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Korea Psychological Counseling Association</span>
              </div>
            </div>
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6 mr-4 border-r border-white/10 pr-6">
            {[
              { name: '협회소개', href: '#협회소개' },
              { name: '인사말', href: '#인사말' },
              { name: '연혁', href: '#연혁' },
              { name: '상담프로그램', href: '#상담프로그램' },
              { name: '교육과정', href: '#교육과정' },
              { name: '게시판', href: '#게시판' },
            ].map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-medium text-gray-400 hover:text-brand-purple transition-colors">
                {item.name}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold text-xs">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-300 font-medium">{user.email?.split('@')[0]}님</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-2 flex items-center gap-2"
                >
                  <LogOut size={14} />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onLoginClick}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2"
                >
                  로그인
                </button>
                <button 
                  onClick={onSignupClick}
                  className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all"
                >
                  회원가입
                </button>
              </>
            )}
            
            {isAdminUser && (
              <button 
                onClick={onAdminClick}
                className="px-4 py-2 rounded-full purple-gradient text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-brand-purple/20"
              >
                <LayoutDashboard size={14} />
                관리자
              </button>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-brand-dark-gray border-b border-white/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {['협회소개', '상담프로그램', '교육과정', '게시판', '커뮤니티'].map((item) => (
                <a key={item} href={`#${item}`} className="text-lg font-medium text-gray-300">{item}</a>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
                {user ? (
                  <button onClick={onLogout} className="col-span-2 py-3 rounded-xl glass-effect text-white font-medium flex items-center justify-center gap-2">
                    <LogOut size={18} /> 로그아웃
                  </button>
                ) : (
                  <>
                    <button onClick={onLoginClick} className="py-3 rounded-xl glass-effect text-white font-medium">로그인</button>
                    <button onClick={onSignupClick} className="py-3 rounded-xl bg-white/10 text-white font-medium">회원가입</button>
                  </>
                )}
              </div>
              {isAdminUser && (
                <button onClick={onAdminClick} className="w-full py-3 rounded-xl purple-gradient text-white font-bold">관리자 대시보드</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Greeting = () => (
  <section id="인사말" className="py-32 bg-brand-black relative overflow-hidden">
    {/* Forest Background with Overlay */}
    <div className="absolute inset-0 z-0 overflow-hidden">
      <motion.img 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1920" 
        alt="Atmospheric Forest" 
        className="w-full h-full object-cover opacity-25"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-purple/5 to-brand-black"></div>
      {/* Fog Effect Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-white/5 blur-3xl animate-fog transform -skew-x-12"></div>
        <div className="absolute inset-0 bg-white/5 blur-2xl animate-fog delay-700 transform skew-x-12"></div>
      </div>
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-purple font-bold tracking-widest uppercase mb-4 block">President's Greeting</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            회원여러분의 풍부한 경험과 <br />
            <span className="text-gradient">전문지식을 결집하여</span>
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-transparent p-12 rounded-[40px] relative"
        >
          <div className="space-y-8 text-gray-300 leading-relaxed text-lg text-justify">
            <p>
              한국심리상담지도협회가 시작되어 짧지 않은 시간이 지났습니다. 
              2007년 3월 실무이사 7명, 심리상담 전공교수 15명 등 22명이 발기인대회를 갖고 창립총회를 연 것이 엊그제 같은데 이제는 1,900여 명의 회원과 전문인력을 보유한 심리상담 전문가 단체로 발전하였습니다.
            </p>
            <p>
              그동안 어려운 여건 속에서도 심리상담과 청소년진로에 관한 연구와 프로그램을 개발·보급하고 이를 현장에 접목시켜 온 회원 여러분에게 심심한 존경과 감사의 말씀을 드립니다. 여러분께서 잘 아시는 바와 같이 우리 협회의 심리상담 프로그램은 독창성과 현장성이 결집된 실용적기법이 폭넓게 적용되어 때와 장소, 각계각층을 불문하고 다양한 형태로 활용되고 있습니다.
            </p>
            <p>
              우리 협회가 개발한 성격검사지, 진로 및 심리상담 프로그램과 심리상담 실무자들의 우수한 능력과 자질이 높이 평가되어 심리상담 전문가 그룹으로 그 위상과 지위를 확고하게 다져나가고 있습니다. 2014년부터는 청소년상담심리학회 및 한국청소년보호연맹과 전략적으로 제휴하여 연구 성과물의 교류와 협력 및 상담심리 전문가 양성을 위한 자격연수과정 개설에 합의하는 성과를 거두었습니다.
            </p>
            <p>
              이제 우리는 보다 탄탄하게 내실을 다져나가면서 상황에 맞는 이론과 실무를 병행하여 나가도록 하겠습니다. 앞으로 협회원 한 분 한 분의 풍부한 경험과 전문지식이 결집되어 우리 협회가 한 단계 더 뛰어오를 수 있는 도약의 기회를 만들어 나가도록 기대하며 회원 여러분의 폭넓은 관심과 격려를 부탁드립니다.
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
            <div className="text-brand-purple font-bold text-lg mb-1">한국심리상담지도협회 협회장</div>
            <p className="text-gray-500 mt-4 font-bold">감사합니다.</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const AssociationIntro = () => (
  <section id="협회소개" className="py-32 relative overflow-hidden">
    {/* Forest Background with Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1920" 
        alt="Forest Background" 
        className="w-full h-full object-cover opacity-40"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-brand-black/70"></div>
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">조직 구성</h2>
        <div className="w-20 h-1 purple-gradient mx-auto rounded-full"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-10 rounded-[40px] glass-effect">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center">
              <Shield className="text-brand-purple" size={20} />
            </div>
            설립 목적
          </h3>
          <ul className="space-y-4 text-gray-400">
            {[
              '현장성 있는 심리상담 기법의 개발·보급 및 치료적 상담모형 정립',
              '피부에 와 닿는 실용적 상담기법 개발·활용',
              '정서적·심리적 갈등해소 및 개인·가정·사회생활의 질적 향상 지원',
              '이론과 실무가 접목된 현장접근적 전문인력 양성'
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="text-brand-purple shrink-0 mt-1" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-10 rounded-[40px] glass-effect">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center">
              <Users className="text-brand-purple" size={20} />
            </div>
            조직 구성
          </h3>
          <div className="space-y-6">
            <div>
              <ul className="text-gray-400 space-y-4 text-base">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2.5 shrink-0"></div>
                  <span><strong className="text-white">임원:</strong> 회장 1인, 부회장 5인, 이사 15인 이내, 감사 2인</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2.5 shrink-0"></div>
                  <span><strong className="text-white">회원:</strong> 정회원, 준회원 및 단체회원 (약 1,900명)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2.5 shrink-0"></div>
                  <span><strong className="text-white">간사:</strong> 협회장이 정하는 상근회원 1인</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 p-10 rounded-[40px] glass-effect">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center">
              <BarChart3 className="text-brand-purple" size={20} />
            </div>
            주요 사업
          </h3>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 text-gray-400 text-sm">
            {[
              '정서적·심리적 갈등해소를 위한 조사·연구활동',
              '실용성 있는 심리상담기법의 개발·보급 및 활용',
              '심리상담 실무자 연수과정 개설·운영',
              '심리상담 관련 도서의 출판 및 보급',
              '심리상담 프로그램의 개발 및 보급',
              '심리상담 관련 학술·실무 단체와 교류·협력',
              '심리상담 전문인력 양성',
              '상담심리 관련 연구·개발사업'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-purple"></div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const History = () => {
  const historyData = [
    {
      period: '2007 - 2010',
      title: '설립 및 기반 구축기',
      items: [
        { date: '2007. 03', text: '한국심리상담지도협회 창립총회 개최' },
        { date: '2007. 12', text: '건국대학교 사회교육원 교육과정 협약' },
        { date: '2010. 02', text: '여성가족부 경력단절여성 집단상담 운영' },
        { date: '2010. 08', text: '육군방공학교 간부·가족 상담 교육 실시' }
      ]
    },
    {
      period: '2011 - 2015',
      title: '검사 도구 및 자격 체계화기',
      items: [
        { date: '2011. 06', text: '미술심리상담사 민간자격 등록' },
        { date: '2011. 07', text: '한국휴먼에니어그램 검사지 개발' },
        { date: '2013. 05', text: '가족 및 노인심리상담사 과정 확대' },
        { date: '2015. 10', text: '실무자 보수 교육 시스템(LMS) 설계' }
      ]
    },
    {
      period: '2016 - 2022',
      title: '영역 확장 및 전문성 고도화기',
      items: [
        { date: '2016. 04', text: '분노조절 및 위기심리상담사 런칭' },
        { date: '2020. 03', text: '비대면 심리 지원 가이드라인 수립' },
        { date: '2022. 11', text: '아동·청소년 진로 상담 도구 고도화' }
      ]
    },
    {
      period: '2024 - 현재',
      title: '미래 지향적 통합 상담 체계기',
      items: [
        { date: '2024. 05', text: '다문화 가정 심리 상담 매뉴얼 보급' },
        { date: '2025. 02', text: 'AI 기반 심리 검사 분석 시스템 도입' },
        { date: '2026. 01', text: '협회 창립 19주년, 표준화 선도' }
      ]
    }
  ];

  return (
    <section id="연혁" className="py-32 bg-brand-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">협회 연혁</h2>
          <p className="text-gray-400">2007년부터 이어온 신뢰와 전문성의 발자취입니다.</p>
        </div>
        
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-purple/0 via-brand-purple to-brand-purple/0 hidden md:block"></div>
          
          <div className="space-y-20">
            {historyData.map((group, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row gap-8 items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 w-full ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="text-brand-purple font-bold text-xl mb-2 block">{group.period}</span>
                  <h3 className="text-2xl font-bold mb-4">{group.title}</h3>
                </div>
                
                <div className="relative z-10 w-12 h-12 rounded-full purple-gradient flex items-center justify-center shadow-lg shadow-brand-purple/30 shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="p-8 rounded-3xl glass-effect space-y-4">
                    {group.items.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="text-brand-purple font-bold whitespace-nowrap text-sm mt-1">{item.date}</span>
                        <span className="text-gray-400 text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000')" }}>
    {/* Background Overlay - Gradient for better text readability and image integration */}
    <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/40 z-0" />
    
    {/* Background Elements */}
    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-purple/15 blur-[120px] rounded-full z-0" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full z-0" />
    
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-effect text-brand-purple text-xs font-bold tracking-widest uppercase mb-6">
            Professional Psychological Services
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            마음의 평온을 찾는 <br />
            <span className="text-gradient">새로운 시작</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            한국심리상담지도협회는 전문적인 상담과 체계적인 교육을 통해 <br className="hidden md:block" />
            여러분의 삶에 따뜻한 변화와 성장을 함께합니다.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 rounded-2xl purple-gradient text-white font-bold shadow-xl shadow-brand-purple/30 hover:scale-105 transition-transform flex items-center gap-2">
              상담 예약하기 <ChevronRight size={20} />
            </button>
            <button className="px-8 py-4 rounded-2xl glass-effect text-white font-bold hover:bg-white/10 transition-all">
              교육과정 보기
            </button>
          </div>
        </motion.div>
      </div>
    </div>
    
    {/* Decorative Image/Card removed to prioritize background image */}
  </section>
);

const Stats = () => (
  <section className="py-20 border-y border-white/5">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: '누적 상담 시간', value: '15,000+', icon: Clock },
          { label: '협력 전문가', value: '1,200+', icon: Users },
          { label: '협력 기관', value: '35', icon: Shield },
          { label: '고객 만족도', value: '98%', icon: Heart },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-brand-purple/10 flex items-center justify-center">
              <stat.icon className="text-brand-purple w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Programs = () => (
  <section id="상담프로그램" className="py-32 bg-brand-dark-gray/30">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">맞춤형 심리 솔루션</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">각 분야의 전문가들이 개인의 상황에 맞는 최적의 상담 프로그램을 제공합니다.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: '개인 심리 상담', desc: '우울, 불안, 대인관계 등 개인의 내면적 갈등을 해결하고 자아 성장을 돕습니다.', icon: Users, color: 'from-purple-500 to-indigo-500' },
          { title: '부부 및 가족 상담', desc: '가족 구성원 간의 소통 부재와 갈등을 해소하고 건강한 관계 회복을 지원합니다.', icon: Heart, color: 'from-pink-500 to-rose-500' },
          { title: '청소년 상담', desc: '학업 스트레스, 진로 고민, 사춘기 갈등 등 청소년기의 특수한 고민을 함께 나눕니다.', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
          { title: 'K5(KTDRI)상담', desc: 'K5(KTDRI) 검사를 통해 개인의 성격 유형과 심리 상태를 정밀하게 분석하고 맞춤형 해결책을 제시합니다.', icon: Award, color: 'from-indigo-600 to-blue-600' },
          { title: 'META-상담', desc: '메타인지 기반의 상담을 통해 자신의 사고 과정을 객관화하고 근본적인 변화를 이끌어냅니다.', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
          { title: '드론 우울 상담', desc: '드론 기술과 심리 상담을 결합하여 새로운 시각에서 우울감을 해소하는 혁신적인 프로그램입니다.', icon: Share2, color: 'from-orange-500 to-amber-500' },
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="p-8 rounded-[40px] glass-effect group cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
              <item.icon className="text-white w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-8">{item.desc}</p>
            <button className="text-brand-purple font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
              자세히 보기 <ChevronRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CounselingForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: '개인 심리 상담',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('consultations')
        .insert([
          { 
            name: formData.name, 
            phone: formData.phone, 
            category: formData.category, 
            content: formData.content,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', phone: '', category: '개인 심리 상담', content: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="상담신청" className="py-32 bg-brand-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto glass-effect rounded-[48px] p-8 md:p-16 border border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">상담 신청란</h2>
            <p className="text-gray-400">도움이 필요하신가요? 아래 양식을 작성해 주시면 전문가가 연락드리겠습니다.</p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-green-500 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">신청이 완료되었습니다!</h3>
              <p className="text-gray-400">빠른 시일 내에 연락드리겠습니다.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-2">성함</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="성함을 입력해주세요" 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-2">연락처</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010-0000-0000" 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple transition-colors" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-2">희망 상담 분야</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-brand-dark-gray border border-white/10 focus:outline-none focus:border-brand-purple transition-colors"
                >
                  <option>개인 심리 상담</option>
                  <option>부부 및 가족 상담</option>
                  <option>청소년 상담</option>
                  <option>K5(KTDRI)상담</option>
                  <option>META-상담</option>
                  <option>드론 우울 상담</option>
                  <option>기타</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-2">문의 내용</label>
                <textarea 
                  rows={4} 
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="상담받고 싶은 내용을 간략히 적어주세요" 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 ml-2">
                <input required type="checkbox" id="privacy" className="w-5 h-5 rounded border-white/10 bg-white/5 text-brand-purple focus:ring-brand-purple" />
                <label htmlFor="privacy" className="text-sm text-gray-400">개인정보 수집 및 이용에 동의합니다.</label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 rounded-2xl purple-gradient text-white font-bold text-lg shadow-xl shadow-brand-purple/30 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '처리 중...' : '상담 신청하기'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Education = () => (
  <section id="교육과정" className="py-32">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">전문가 양성 교육</h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            이론과 실무가 조화된 체계적인 커리큘럼을 통해 <br />
            최고 수준의 심리상담 전문가를 육성합니다.
          </p>
          
          <div className="space-y-6">
            {[
              { title: '심리상담사 과정', },
              { title: '미술치료 전문가 과정', level: '심화 과정' },
              { title: '기업 상담 전문가 양성', level: 'B2B 특화' },
              { title: '실버활동지도사', level: '자격 과정' },
              { title: '재난안전관리지도사', level: '전문가 과정' },
              { title: '인성교육지도사', level: '지도자 과정' },
              { title: '방과후아동지도사', level: '실무 과정' },
            ].map((edu, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-purple/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Award className="text-brand-purple" />
                  <span className="text-lg font-medium">{edu.title}</span>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple">{edu.level}</span>
              </div>
            ))}
          </div>
          
          <button className="mt-12 px-10 py-4 rounded-2xl purple-gradient text-white font-bold">
            전체 교육 일정 확인
          </button>
        </div>
        
        <div className="flex-1 relative">
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" className="rounded-[40px] mt-12" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" className="rounded-[40px]" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 purple-gradient rounded-full blur-[60px] opacity-50" />
        </div>
      </div>
    </div>
  </section>
);

const Board = ({ photoPosts }: { photoPosts: PhotoPost[] }) => {
  const [activeTab, setActiveTab] = React.useState<'free' | 'photo'>('free');

  const freePosts = [
    { id: 1, title: '협회 방문 후기 남깁니다.', author: '홍길동', date: '2024-03-15' },
    { id: 2, title: '상담사 자격증 취득 관련 질문입니다.', author: '김철수', date: '2024-03-14' },
    { id: 3, title: '교육 과정이 정말 유익하네요.', author: '이영희', date: '2024-03-12' },
    { id: 4, title: 'K5 성격유형검사 결과가 신기해요.', author: '박지민', date: '2024-03-10' },
    { id: 5, title: '협회 발전을 기원합니다.', author: '최유진', date: '2024-03-08' },
  ];

  return (
    <section id="게시판" className="py-32 bg-brand-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">커뮤니티 게시판</h2>
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={() => setActiveTab('free')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'free' ? 'purple-gradient text-white' : 'glass-effect text-gray-400'}`}
            >
              자유게시판
            </button>
            <button 
              onClick={() => setActiveTab('photo')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'photo' ? 'purple-gradient text-white' : 'glass-effect text-gray-400'}`}
            >
              사진 자료실
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {activeTab === 'free' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-[32px] overflow-hidden"
            >
              <div className="divide-y divide-white/5">
                {freePosts.map((post) => (
                  <div key={post.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 text-sm w-8">{post.id}</span>
                      <h3 className="font-bold group-hover:text-brand-purple transition-colors">{post.title}</h3>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white/5 flex justify-center">
                <button className="text-sm font-bold text-brand-purple flex items-center gap-2">
                  더보기 <Plus size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {photoPosts.map((photo) => (
                <div key={photo.id} className="group cursor-pointer">
                  <div className="relative aspect-square rounded-3xl overflow-hidden mb-3">
                    <img 
                      src={photo.image} 
                      alt={photo.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Search className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-center group-hover:text-brand-purple transition-colors">{photo.title}</h3>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const Blog = ({ posts }: { posts: Post[] }) => (
  <section id="커뮤니티" className="py-32 bg-brand-dark-gray/30">
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-4xl font-bold mb-4">심리 칼럼 & 공지</h2>
          <p className="text-gray-400">협회의 새로운 소식과 유익한 심리 정보를 만나보세요.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-brand-purple font-bold">
          전체보기 <ArrowUpRight size={20} />
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <motion.article 
            key={post.id}
            whileHover={{ y: -10 }}
            className="group"
          >
            <div className="relative overflow-hidden rounded-[32px] mb-6 aspect-[4/3]">
              <img 
                src={post.image} 
                alt={post.title} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 px-4 py-1 rounded-full glass-effect text-xs font-bold">
                {post.category}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-brand-purple transition-colors line-clamp-1">
              {post.title}
            </h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

const Footer = ({ onAdminClick }: { onAdminClick: () => void }) => (
  <footer className="bg-brand-black pt-20 pb-10 border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-2">
          <div className="mb-8">
            <a href="/" className="flex items-center gap-3">
              <img 
                src="https://images.weserv.nl/?url=kpcga.or.kr/theme/f002/img/logo.png&w=400&h=120&fit=contain" 
                alt="한국심리상담지도협회 Logo" 
                className="h-14 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
                referrerPolicy="no-referrer"
              />
              <div className="logo-fallback hidden flex items-center gap-3">
                <div className="w-10 h-10 purple-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
                  <Heart className="text-white w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight text-white leading-none">한국심리상담지도협회</span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Korea Psychological Counseling Association</span>
                </div>
              </div>
            </a>
          </div>
          <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
            우리는 모든 사람이 심리적 안정을 찾고 더 나은 삶을 영위할 수 있도록 전문적인 지원을 아끼지 않습니다.
          </p>
          <div className="flex gap-4">
            {[Instagram, Facebook, MessageCircle, Share2].map((Icon, i) => (
              <button key={i} className="w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all">
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">협회 소개</a></li>
            <li><a href="#" className="hover:text-white transition-colors">상담 예약</a></li>
            <li><a href="#" className="hover:text-white transition-colors">교육 신청</a></li>
            <li><a href="#" className="hover:text-white transition-colors">자격증 조회</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6">Contact</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li className="flex items-center gap-3"><MapPin size={16} /> 경기도 수원시 팔달구 고등로 서밋플라자 3025호</li>
            <li className="flex items-center gap-3"><Phone size={16} /> 031-566-1318</li>
            <li className="flex items-center gap-3"><Mail size={16} /> hap3clover@hanmail.net</li>
          </ul>
          <div className="mt-8 pt-8 border-t border-white/5">
            <button 
              onClick={onAdminClick}
              className="text-[10px] text-gray-600 hover:text-brand-purple transition-colors uppercase tracking-widest font-bold"
            >
              Admin Access
            </button>
          </div>
        </div>
      </div>
      
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600">
        <p>© 2024 한국심리상담지도협회. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#">개인정보처리방침</a>
          <a href="#">이용약관</a>
          <a href="#">이메일무단수집거부</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Admin Components ---

const AdminDashboard = ({ 
  onBack, 
  posts, 
  setPosts, 
  photoPosts, 
  setPhotoPosts 
}: { 
  onBack: () => void, 
  posts: Post[], 
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  photoPosts: PhotoPost[],
  setPhotoPosts: React.Dispatch<React.SetStateAction<PhotoPost[]>>
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingConsultation, setIsAddingConsultation] = useState(false);
  const [addType, setAddType] = useState<'post' | 'photo'>('post');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<PhotoPost | null>(null);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  useEffect(() => {
    if (activeTab === 'consultations' || activeTab === 'overview') {
      fetchConsultations();
    }
  }, [activeTab]);

  const fetchConsultations = async () => {
    setLoadingConsultations(true);
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoadingConsultations(false);
    }
  };

  const handleSaveConsultation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newConsultation = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      category: formData.get('category') as string,
      content: formData.get('content') as string,
      status: 'pending'
    };

    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([newConsultation])
        .select();

      if (error) throw error;
      setConsultations([data[0], ...consultations]);
      setIsAddingConsultation(false);
    } catch (error) {
      console.error('Error saving consultation:', error);
      alert('상담 내역 등록 중 오류가 발생했습니다.');
    }
  };

  const handleUpdateConsultationStatus = async (id: string, newStatus: 'pending' | 'completed' | 'canceled') => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setConsultations(consultations.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error('Error updating consultation status:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteConsultation = async (id: string) => {
    if (!confirm('상담 신청 내역을 정말 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setConsultations(consultations.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting consultation:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDeletePost = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('사진을 삭제하시겠습니까?')) {
      setPhotoPosts(photoPosts.filter(p => p.id !== id));
    }
  };

  const handleSavePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPost: Post = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      content: formData.get('content') as string,
      date: new Date().toISOString().split('T')[0],
      author: '관리자',
      image: `https://picsum.photos/seed/${Date.now()}/800/600`
    };

    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? newPost : p));
    } else {
      setPosts([newPost, ...posts]);
    }
    setIsAdding(false);
    setEditingPost(null);
  };

  const handleSavePhoto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPhoto: PhotoPost = {
      id: editingPhoto?.id || Date.now().toString(),
      title: formData.get('title') as string,
      image: uploadImage || (formData.get('image') as string) || `https://picsum.photos/seed/${Date.now()}/800/600`,
      date: new Date().toISOString().split('T')[0]
    };

    if (editingPhoto) {
      setPhotoPosts(photoPosts.map(p => p.id === editingPhoto.id ? newPhoto : p));
    } else {
      setPhotoPosts([newPhoto, ...photoPosts]);
    }
    setIsAdding(false);
    setEditingPhoto(null);
    setUploadImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark-gray border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 purple-gradient rounded-lg flex items-center justify-center">
            <Heart size={18} />
          </div>
          <span className="font-bold text-sm">KPCA Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', label: '대시보드', icon: BarChart3 },
            { id: 'consultations', label: '상담 관리', icon: MessageCircle },
            { id: 'posts', label: '게시글 관리', icon: FileText },
            { id: 'photos', label: '사진 자료실 관리', icon: Instagram },
            { id: 'users', label: '회원 관리', icon: Users },
            { id: 'settings', label: '사이트 설정', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut size={18} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-3 rounded-2xl glass-effect text-gray-400 hover:text-white transition-all"
              title="사이트로 돌아가기"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {activeTab === 'overview' && '대시보드 현황'}
                {activeTab === 'consultations' && '상담 신청 관리'}
                {activeTab === 'posts' && '게시글 관리'}
                {activeTab === 'photos' && '사진 자료실 관리'}
                {activeTab === 'users' && '회원 관리'}
                {activeTab === 'settings' && '사이트 설정'}
              </h1>
              <p className="text-sm text-gray-500">환영합니다, 관리자님. 오늘의 사이트 현황입니다.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl glass-effect text-gray-400 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right">
                <div className="text-sm font-bold">관리자</div>
                <div className="text-xs text-gray-500">Super Admin</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center font-bold text-brand-purple">
                AD
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: '오늘의 방문자', value: '1,284', trend: '+12%', icon: Users },
                { label: '총 상담 신청', value: consultations.length.toString(), trend: 'New', icon: Clock },
                { label: '총 게시글', value: posts.length.toString(), trend: '+2', icon: FileText },
                { label: '매출 현황', value: '₩4.2M', trend: '+18%', icon: BarChart3 },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-3xl glass-effect">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-brand-purple/10 text-brand-purple">
                      <stat.icon size={20} />
                    </div>
                    <span className="text-xs font-bold text-green-500">{stat.trend}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <button 
                onClick={() => { setActiveTab('posts'); setAddType('post'); setIsAdding(true); }} 
                className="p-8 rounded-[32px] glass-effect flex flex-col items-center gap-4 hover:bg-brand-purple/10 transition-all border border-white/5 group"
              >
                <div className="p-4 rounded-2xl bg-brand-purple/10 text-brand-purple group-hover:scale-110 transition-transform">
                  <Plus size={32} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">공지사항 작성</div>
                  <p className="text-xs text-gray-500 mt-1">새로운 소식을 등록합니다.</p>
                </div>
              </button>
              <button 
                onClick={() => { setActiveTab('photos'); setAddType('photo'); setIsAdding(true); }} 
                className="p-8 rounded-[32px] glass-effect flex flex-col items-center gap-4 hover:bg-brand-purple/10 transition-all border border-white/5 group"
              >
                <div className="p-4 rounded-2xl bg-brand-purple/10 text-brand-purple group-hover:scale-110 transition-transform">
                  <Instagram size={32} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">사진 업로드</div>
                  <p className="text-xs text-gray-500 mt-1">활동 사진을 추가합니다.</p>
                </div>
              </button>
              <button 
                onClick={() => setIsAddingConsultation(true)} 
                className="p-8 rounded-[32px] glass-effect flex flex-col items-center gap-4 hover:bg-brand-purple/10 transition-all border border-white/5 group"
              >
                <div className="p-4 rounded-2xl bg-brand-purple/10 text-brand-purple group-hover:scale-110 transition-transform">
                  <MessageCircle size={32} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">상담 내역 등록</div>
                  <p className="text-xs text-gray-500 mt-1">수동으로 상담을 등록합니다.</p>
                </div>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 rounded-[32px] glass-effect">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold">최근 업데이트 내역</h3>
                  <span className="px-2 py-1 rounded-lg bg-brand-purple/20 text-brand-purple text-[10px] font-bold">NEW</span>
                </div>
                <div className="space-y-4">
                  {[
                    { title: '상담 내역 수동 등록 기능 추가', date: '2024-03-19', desc: '관리자가 직접 상담 신청을 등록할 수 있습니다.' },
                    { title: '회원 관리 시스템 구축', date: '2024-03-19', desc: '전체 회원 목록 및 권한 관리가 가능합니다.' },
                    { title: '대시보드 퀵 액션 버튼 도입', date: '2024-03-19', desc: '홈 화면에서 즉시 주요 작업을 수행할 수 있습니다.' },
                    { title: '관리자 전용 배너 및 접근성 개선', date: '2024-03-19', desc: '사이트 어디서든 관리자 모드로 빠른 진입이 가능합니다.' },
                  ].map((update, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-sm font-bold text-brand-purple">{update.title}</div>
                        <span className="text-[10px] text-gray-500">{update.date}</span>
                      </div>
                      <p className="text-xs text-gray-400">{update.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 rounded-[32px] glass-effect">
                <h3 className="font-bold mb-6">최근 상담 예약</h3>
                <div className="space-y-4">
                  {loadingConsultations ? (
                    <div className="text-center py-4 text-gray-500">로딩 중...</div>
                  ) : consultations.length > 0 ? (
                    consultations.slice(0, 5).map(consultation => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center font-bold text-brand-purple">
                            {consultation.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-bold">{consultation.name}</div>
                            <div className="text-xs text-gray-500">{consultation.category}</div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(consultation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">신청된 상담이 없습니다.</div>
                  )}
                </div>
              </div>
              <div className="p-8 rounded-[32px] glass-effect">
                <h3 className="font-bold mb-6">인기 게시글</h3>
                <div className="space-y-4">
                  {posts.slice(0, 3).map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                      <div className="text-sm font-medium truncate max-w-[200px]">{post.title}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users size={12} /> 1.2k
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="상담 신청 검색..." 
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsAddingConsultation(true)}
                  className="px-5 py-2 rounded-xl purple-gradient text-white text-sm font-bold flex items-center gap-2"
                >
                  <Plus size={18} /> 수동 등록
                </button>
                <button 
                  onClick={fetchConsultations}
                  className="px-5 py-2 rounded-xl glass-effect text-white text-sm font-bold flex items-center gap-2"
                >
                  새로고침
                </button>
              </div>
            </div>

            <div className="rounded-3xl glass-effect overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">신청자</th>
                    <th className="px-6 py-4 font-medium">연락처</th>
                    <th className="px-6 py-4 font-medium">상담 분야</th>
                    <th className="px-6 py-4 font-medium">상태</th>
                    <th className="px-6 py-4 font-medium">신청 날짜</th>
                    <th className="px-6 py-4 font-medium text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingConsultations ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">로딩 중...</td>
                    </tr>
                  ) : consultations.length > 0 ? (
                    consultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold">{consultation.name}</div>
                          <div className="text-[10px] text-gray-500 mt-1 max-w-[150px] truncate" title={consultation.content}>
                            {consultation.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{consultation.phone}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold">
                            {consultation.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={consultation.status || 'pending'}
                            onChange={(e) => handleUpdateConsultationStatus(consultation.id, e.target.value as any)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-transparent border border-white/10 focus:outline-none ${
                              consultation.status === 'completed' ? 'text-green-500' : 
                              consultation.status === 'canceled' ? 'text-red-500' : 'text-yellow-500'
                            }`}
                          >
                            <option value="pending" className="bg-brand-dark-gray">대기 중</option>
                            <option value="completed" className="bg-brand-dark-gray">처리 완료</option>
                            <option value="canceled" className="bg-brand-dark-gray">취소됨</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(consultation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteConsultation(consultation.id)}
                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">신청된 상담이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="게시글 검색..." 
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>
              <button 
                onClick={() => { setAddType('post'); setIsAdding(true); }}
                className="px-5 py-2 rounded-xl purple-gradient text-white text-sm font-bold flex items-center gap-2"
              >
                <Plus size={18} /> 새 글 작성
              </button>
            </div>

            <div className="rounded-3xl glass-effect overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">제목</th>
                    <th className="px-6 py-4 font-medium">카테고리</th>
                    <th className="px-6 py-4 font-medium">작성자</th>
                    <th className="px-6 py-4 font-medium">날짜</th>
                    <th className="px-6 py-4 font-medium text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{post.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{post.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{post.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setAddType('post'); setEditingPost(post); setIsAdding(true); }}
                            className="p-2 rounded-lg hover:bg-white/10 text-blue-400"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">사진 자료실 ({photoPosts.length})</h2>
              <button 
                onClick={() => { setAddType('photo'); setIsAdding(true); }}
                className="px-5 py-2 rounded-xl purple-gradient text-white text-sm font-bold flex items-center gap-2"
              >
                <Plus size={18} /> 사진 추가
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {photoPosts.map((photo) => (
                <div key={photo.id} className="p-4 rounded-[32px] glass-effect group">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                    <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => { setAddType('photo'); setEditingPhoto(photo); setIsAdding(true); }}
                        className="p-3 rounded-full bg-white/10 text-white hover:bg-brand-purple transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-3 rounded-full bg-white/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-center mb-1">{photo.title}</h3>
                  <p className="text-[10px] text-gray-500 text-center">{photo.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="회원 검색..." 
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold">전체 회원</button>
                <button className="px-4 py-2 rounded-xl glass-effect text-gray-400 text-xs font-bold">관리자</button>
              </div>
            </div>

            <div className="rounded-3xl glass-effect overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">이메일</th>
                    <th className="px-6 py-4 font-medium">가입일</th>
                    <th className="px-6 py-4 font-medium">상태</th>
                    <th className="px-6 py-4 font-medium">권한</th>
                    <th className="px-6 py-4 font-medium text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">heungweeryu@gmail.com</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">2024-03-01</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-500 text-[10px] font-bold uppercase">Active</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase">Admin</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400">
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">user@example.com</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">2024-03-15</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-500 text-[10px] font-bold uppercase">Active</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-white/10 text-gray-400 text-[10px] font-bold uppercase">User</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400">
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <div className="p-8 rounded-[32px] glass-effect">
              <h3 className="font-bold mb-6">일반 설정</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">사이트 이름</label>
                  <input type="text" defaultValue="한국심리상담지도협회" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">대표 이메일</label>
                  <input type="email" defaultValue="hap3clover@hanmail.net" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple" />
                </div>
              </div>
            </div>
            
            <div className="p-8 rounded-[32px] glass-effect">
              <h3 className="font-bold mb-6">디자인 커스터마이징</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-4">포인트 컬러</label>
                  <div className="flex gap-4">
                    {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                      <button 
                        key={color} 
                        className={`w-10 h-10 rounded-full border-2 ${color === '#8b5cf6' ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">메인 폰트</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-brand-dark-gray border border-white/10 focus:outline-none focus:border-brand-purple">
                    <option>Pretendard (기본)</option>
                    <option>Noto Sans KR</option>
                    <option>Inter</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button className="w-full py-4 rounded-2xl purple-gradient text-white font-bold shadow-xl shadow-brand-purple/20">
              설정 저장하기
            </button>
          </div>
        )}
      </main>

      {/* Post/Photo Editor Modal */}
      <AnimatePresence>
        {isAddingConsultation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingConsultation(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-brand-dark-gray rounded-[40px] p-10 border border-white/10 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <MessageCircle className="text-brand-purple" />
                상담 내역 수동 등록
              </h2>
              
              <form onSubmit={handleSaveConsultation} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">신청자 성함</label>
                    <input name="name" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">연락처</label>
                    <input name="phone" required placeholder="010-0000-0000" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">상담 분야</label>
                  <select name="category" className="w-full px-4 py-3 rounded-xl bg-brand-black border border-white/10 focus:outline-none focus:border-brand-purple">
                    <option>개인 심리 상담</option>
                    <option>부부 및 가족 상담</option>
                    <option>청소년 상담</option>
                    <option>K5(KTDRI)상담</option>
                    <option>META-상담</option>
                    <option>드론 우울 상담</option>
                    <option>기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">상담 내용</label>
                  <textarea name="content" rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple resize-none" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsAddingConsultation(false)} className="flex-1 py-4 rounded-2xl glass-effect font-bold">취소</button>
                  <button type="submit" className="flex-1 py-4 rounded-2xl purple-gradient text-white font-bold">등록하기</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAdding(false); setEditingPost(null); setEditingPhoto(null); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-brand-dark-gray rounded-[40px] p-10 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-bold mb-8">
                {addType === 'post' ? (editingPost ? '게시글 수정' : '새 게시글 작성') : (editingPhoto ? '사진 정보 수정' : '새 사진 추가')}
              </h2>
              
              {addType === 'post' ? (
                <form onSubmit={handleSavePost} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">제목</label>
                      <input name="title" required defaultValue={editingPost?.title} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">카테고리</label>
                      <select name="category" defaultValue={editingPost?.category} className="w-full px-4 py-3 rounded-xl bg-brand-black border border-white/10 focus:outline-none focus:border-brand-purple">
                        <option>심리칼럼</option>
                        <option>공지사항</option>
                        <option>교육정보</option>
                        <option>상담후기</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">내용</label>
                    <textarea name="content" required rows={6} defaultValue={editingPost?.content} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple resize-none" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => { setIsAdding(false); setEditingPost(null); }} className="flex-1 py-4 rounded-2xl glass-effect font-bold">취소</button>
                    <button type="submit" className="flex-1 py-4 rounded-2xl purple-gradient text-white font-bold">저장하기</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSavePhoto} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">사진 제목</label>
                    <input name="title" required defaultValue={editingPhoto?.title} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">사진 업로드</label>
                    <div className="flex flex-col gap-4">
                      <div className="relative group cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="w-full aspect-video rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 group-hover:border-brand-purple transition-colors overflow-hidden">
                          {(uploadImage || editingPhoto?.image) ? (
                            <img src={uploadImage || editingPhoto?.image} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Plus className="text-gray-500" />
                              <span className="text-xs text-gray-500">클릭하여 사진 선택</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-center text-xs text-gray-500">또는 이미지 URL 입력</div>
                      <input name="image" defaultValue={editingPhoto?.image} placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple" />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => { setIsAdding(false); setEditingPhoto(null); setUploadImage(null); }} className="flex-1 py-4 rounded-2xl glass-effect font-bold">취소</button>
                    <button type="submit" className="flex-1 py-4 rounded-2xl purple-gradient text-white font-bold">저장하기</button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Auth Components ---

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: { isOpen: boolean, onClose: () => void, initialMode?: 'login' | 'signup' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('인증 이메일이 발송되었습니다. 이메일을 확인해주세요.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-brand-dark-gray rounded-[40px] p-10 border border-white/10 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-2 text-center">
              {mode === 'login' ? '로그인' : '회원가입'}
            </h2>
            <p className="text-gray-400 text-sm text-center mb-8">
              {mode === 'login' ? '협회 회원 서비스 이용을 위해 로그인해주세요.' : '새로운 회원이 되어 다양한 혜택을 누리세요.'}
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center">
                {message}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">이메일</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">비밀번호</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-purple transition-colors" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 rounded-2xl purple-gradient text-white font-bold text-lg shadow-xl shadow-brand-purple/30 hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {loading ? '처리 중...' : (mode === 'login' ? '로그인' : '회원가입')}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm text-gray-400 hover:text-brand-purple transition-colors"
              >
                {mode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [photoPosts, setPhotoPosts] = useState<PhotoPost[]>(INITIAL_PHOTO_POSTS);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginClick = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isAdminUser = user?.email === 'heungweeryu@gmail.com';

  const AdminBanner = ({ onEnterAdmin }: { onEnterAdmin: () => void }) => (
    <div className="bg-brand-purple/10 border-b border-brand-purple/20 py-2 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-medium text-brand-purple">
        <Shield size={14} />
        <span>관리자 권한으로 접속 중입니다.</span>
      </div>
      <button 
        onClick={onEnterAdmin}
        className="text-xs font-bold text-brand-purple hover:underline"
      >
        관리자 모드 진입 →
      </button>
    </div>
  );

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isAdmin]);

  if (isAdmin && isAdminUser) {
    return (
      <AdminDashboard 
        onBack={() => setIsAdmin(false)} 
        posts={posts} 
        setPosts={setPosts} 
        photoPosts={photoPosts} 
        setPhotoPosts={setPhotoPosts} 
      />
    );
  }

  return (
    <div className="min-h-screen">
      {isAdminUser && !isAdmin && <AdminBanner onEnterAdmin={() => setIsAdmin(true)} />}
      {/* SEO Meta Tags (Handled by component structure) */}
      <Navbar 
        onAdminClick={() => setIsAdmin(true)} 
        user={user}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogout={handleLogout}
        isAdminUser={isAdminUser}
      />
      
      <main>
        <Hero />
        <Greeting />
        <AssociationIntro />
        <History />
        <Stats />
        <Programs />
        <CounselingForm />
        <Education />
        <Board photoPosts={photoPosts} />
        <Blog posts={posts} />
      </main>

      <Footer onAdminClick={() => {
        if (isAdminUser) {
          setIsAdmin(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }
      }} />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
      />

      {/* Floating Chat Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full purple-gradient text-white shadow-2xl shadow-brand-purple/40 flex items-center justify-center hover:scale-110 transition-transform z-40">
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
