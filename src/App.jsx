import React, { useState, useEffect, useRef } from 'react';
import { Camera, Map, MessageCircle, Sparkles, ChevronRight, User, RefreshCcw, BookOpen, Lightbulb, Image as ImageIcon } from 'lucide-react';

// 1. 전체 질문 은행 (10문항을 랜덤으로 추출하기 위한 풀)
const QUESTION_BANK = [
  { id: 'Q01', category: '공간·역사', q: '바다가 내려다보이는 언덕에서 더 하고 싶은 일은?', a: '파도를 바라보며 깊은 역사 생각하기', b: '곁에 있는 사람과 소소한 수다 떨기', tagsA: '사색,역사관심,감성', tagsB: '소통,관계중심,현장성' },
  { id: 'Q02', category: '음식·오감', q: '관람객에게 맛보여주고 싶은 ‘옛맛’은?', a: '대불호텔에서 끓여내던 서양식 가배(커피)', b: '골목 노점에서 모락모락 피어오르는 찐빵', tagsA: '모던,개화기,세련됨', tagsB: '서민적,따뜻함,친근함' },
  { id: 'Q03', category: '색감', q: '나의 해설과 더 잘 어울리는 색깔 조합은?', a: '오래된 벽돌의 적갈색 + 따뜻한 노란빛', b: '개항장 바다의 푸른색 + 활기찬 붉은색', tagsA: '차분함,안정감,클래식', tagsB: '활력,열정,에너지' },
  { id: 'Q04', category: '해설방식', q: '해설하면서 더 뿌듯한 순간은?', a: '오래된 공간의 숨은 역사를 발견해 알려주는 순간', b: '관람객이 이야기에 몰입하며 질문을 쏟아내는 순간', tagsA: '지식전달,탐구,전문성', tagsB: '상호작용,공감,소통' },
  { id: 'Q05', category: '시간여행', q: '1890년 제물포로 돌아간다면 나의 직업은?', a: '각국 거리를 누비며 소식을 전하는 신문기자', b: '다양한 물건을 떼어다 파는 수완 좋은 상인', tagsA: '기록,관찰,지적호기심', tagsB: '실용성,활동적,비즈니스' },
  { id: 'Q06', category: '감성', q: '해설을 준비할 때 나에게 더 필요한 것은?', a: '조용한 카페에서의 완벽한 대본 정리', b: '일단 현장으로 나가 골목길 걸어보기', tagsA: '계획적,꼼꼼함,체계적', tagsB: '직관적,현장감,행동파' },
  { id: 'Q07', category: '장소취향', q: '비 오는 날, 개항장에서 피하고 싶은 곳은?', a: '관람객이 북적여서 정신없는 박물관 로비', b: '아무도 없어서 썰렁한 야외 언덕길', tagsA: '조용함,집중,개인화', tagsB: '북적임,활기,에너지' },
  { id: 'Q08', category: '창작·상상력', q: '새로운 해설 코스를 짠다면 테마는?', a: '건축물에 얽힌 근대 인물들의 치열한 삶', b: '당시 사람들의 유행과 은밀한 연애담', tagsA: '거시적,역사적의의,진지함', tagsB: '미시적,스토리텔링,흥미위주' },
  { id: 'Q09', category: '디자인', q: '나만의 해설사 명함을 만든다면 재질은?', a: '시간의 흔적이 묻어나는 거친 한지', b: '깔끔하고 세련된 반투명 플라스틱', tagsA: '전통,아날로그,빈티지', tagsB: '현대적,세련됨,디지털' },
  { id: 'Q10', category: '소통', q: '관람객이 엉뚱한 역사 질문을 한다면?', a: '"그건 사실 이렇습니다" 정확한 팩트 짚어주기', b: '"와, 그렇게 생각하실 수도 있겠네요!" 일단 공감하기', tagsA: '정확성,객관성,지식', tagsB: '포용성,유연성,공감' },
  { id: 'Q11', category: 'AI·미래', q: 'AI에게 나의 해설 파트너를 부탁한다면?', a: '모르는 연도와 인물을 바로바로 찾아주는 척척박사 AI', b: '해설 중간중간 농담을 던져 분위기를 띄우는 재치 AI', tagsA: '기능성,보조,정보중심', tagsB: '엔터테인먼트,감성,친화력' },
  { id: 'Q12', category: '이야기', q: '가장 마음이 가는 제물포의 풍경은?', a: '밤바다에 정박해 있는 이양선의 불빛', b: '아침 일찍부터 문을 여는 시끌벅적한 우각동 거리', tagsA: '낭만,신비로움,정적인', tagsB: '일상,생활감,동적인' },
  { id: 'Q13', category: '건축', q: '홍예문을 지날 때 머릿속에 떠오르는 생각은?', a: '일제강점기 아픈 역사와 시대의 무게감', b: '돌을 하나하나 쌓아 올렸을 석공들의 손길', tagsA: '역사의식,거시적시각,진중함', tagsB: '디테일,인간적교감,관찰력' },
  { id: 'Q14', category: '예술·감성', q: '인천아트플랫폼을 관람하는 나만의 방식은?', a: '작품 설명(도판)을 꼼꼼히 읽으며 기획 의도 파악하기', b: '내 마음에 확 와닿는 공간과 색감에 집중하기', tagsA: '분석적,논리적,지적탐구', tagsB: '직관적,감성적,예술적' },
  { id: 'Q15', category: '외교·역사', q: '자유공원 맥아더 장군 동상 앞에 선다면?', a: '한국 현대사의 거대한 전환점을 되짚어보기', b: '공원을 뛰어노는 비둘기와 시민들의 평화로운 일상 보기', tagsA: '역사적맥락,거시안,진지함', tagsB: '현재적가치,일상성,따뜻함' },
  { id: 'Q16', category: '성향', q: '해설 중 예상치 못한 돌발 상황이 발생했다!', a: '당황하지 않고 준비된 메뉴얼대로 차분히 수습하기', b: '재치 있는 애드리브로 오히려 분위기를 유쾌하게 만들기', tagsA: '안정감,철저함,노련함', tagsB: '유연성,위기대처,재치' },
  { id: 'Q17', category: '시간여행', q: '1900년대 각국 영사관 거리를 걷고 있다면?', a: '건축 양식의 차이를 비교하며 근대 도시 계획 분석하기', b: '각국 신사들과 신여성들의 복장과 유행 구경하기', tagsA: '학구적,구조적,전문가', tagsB: '트렌드,시각적재미,관찰자' },
  { id: 'Q18', category: '음식·오감', q: '답사 후 지친 몸을 이끌고 찾아가고 싶은 곳은?', a: '오래된 역사가 깃든 차이나타운의 숨은 중식당', b: '탁 트인 바다 뷰가 보이는 세련된 월미도 카페', tagsA: '전통미식,깊은맛,오래된공간', tagsB: '탁트인시야,현대적감성,휴식' },
  { id: 'Q19', category: '해설방식', q: '해설 대본을 짤 때 가장 공을들이는 부분은?', a: '사건의 연도와 역사적 인물 관계의 정확성', b: '사람들의 귀를 쫑긋 세우게 만드는 첫 오프닝 멘트', tagsA: '완벽주의,학술적,팩트중심', tagsB: '흥미유발,쇼맨십,몰입감' },
  { id: 'Q20', category: '공간·역사', q: '제물포구락부를 마주했을 때 가장 먼저 드는 느낌은?', a: '백 년 전 사교계의 낭만과 쓸쓸한 기취', b: '목조 건물이 풍기는 독특한 이국적 아름다움', tagsA: '역사적상상력,스토리,깊이', tagsB: '시각적아름다움,미적취향,스타일' },
  { id: 'Q21', category: '소통', q: '어린이 관람객에게 개항장을 설명해 준다면?', a: '만화나 애니메이션 캐릭터에 빗대어 쉽게 설명하기', b: '그 당시 아이들은 어떻게 놀았는지 생활상 들려주기', tagsA: '친화력,응용력,재미', tagsB: '생활사,공감대,현실적' },
  { id: 'Q22', category: '장소취향', q: '내가 가장 좋아하는 개항장의 시간대는?', a: '가로등에 불이 켜지기 시작하는 푸른 저녁 황혼 무렵', b: '따스한 햇살이 골목 구석구석 스며드는 나른한 오후', tagsA: '낭만적,감성풍만,차분함', tagsB: '따뜻함,활기참,포근함' },
  { id: 'Q23', category: '창작·상상력', q: '개항장 야행 축제에서 내가 기획해 보고 싶은 프로그램은?', a: '근대 복장을 하고 역사 속 사건을 추리하는 방탈출 게임', b: '옛 가요를 라이브로 들으며 즐기는 야외 달빛 콘서트', tagsA: '체험형,참여,두뇌플레이', tagsB: '청각적감동,힐링,문화예술' },
  { id: 'Q24', category: '디자인', q: '내가 만드는 해설 가이드북의 표지 스타일은?', a: '고풍스러운 흑백 지도와 캘리그라피 제목', b: '직관적이고 컬러풀한 일러스트 인포그래픽', tagsA: '클래식,품격,아날로그', tagsB: '트렌디,시인성,모던' },
  { id: 'Q25', category: 'AI·미래', q: '미래의 해설사에게 가장 기대하는 점은?', a: '시공간을 초월해 그 시절 인물과 직접 대화하는 기술', b: '관람객의 걸음걸이와 표정을 읽고 속도를 맞춰주는 세심함', tagsA: '혁신적,몰입감,디지털체험', tagsB: '맞춤형,배려,인간중심AI' },
  { id: 'Q26', category: '감성', q: '답사를 마치고 돌아오는 길에 주로 하는 생각은?', a: '오늘 전달한 역사 지식이 왜곡되진 않았을까 하는 반성', b: '함께 걸었던 사람들과 나눈 눈빛과 웃음의 여운', tagsA: '책임감,진지함,성찰', tagsB: '감동,유대감,여유' },
  { id: 'Q27', category: '색감', q: '인천항의 옛모습을 떠올릴 때 생각나는 톤은?', a: '빛 바랜 세피아 톤과 묵직한 무채색', b: '활기찬 항구의 원색적인 컬러 바이브', tagsA: '빈티지,묵직함,기록성', tagsB: '다채로움,생동감,역동성' },
  { id: 'Q28', category: '이야기', q: '개항장 골목에서 우연히 발견하고 싶은 보물은?', a: '개항기 당시 누군가가 남긴 친필 일기장', b: '지금은 사라진 오래된 수제 과자점의 레시피 북', tagsA: '역사적가치,문헌,진중함', tagsB: '일상의발견,문화,호기심' },
  { id: 'Q29', category: '성향', q: '새로운 역사 사료나 유물이 발굴되었다는 소식을 들으면?', a: '논문이나 기사를 찾아 내용을 정밀하게 분석해 본다', b: '당장 주말에 그 유물이 있는 장소로 달려간다', tagsA: '탐구적,지적욕구,이론파', tagsB: '실행력,발품,행동파' },
  { id: 'Q30', category: '공간·역사', q: '나에게 ‘개항장’이란 어떤 공간인가요?', a: '대한민국의 근대와 세계가 처음 만난 역사의 무대', b: '시간이 멈춘 듯하면서도 살아 숨 쉬는 나의 산책길', tagsA: '거대서사,역사적의의,사명감', tagsB: '개인적영감,힐링,애정' }
];

export default function App() {
  const [step, setStep] = useState('intro'); // intro, name, quiz, loading, result
  const [docentName, setDocentName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultData, setResultData] = useState(null);
  
  // 음성 안내
  const speakWelcome = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = "안녕하세요. 반갑습니다!";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR'; 
      utterance.rate = 1.0;   
      window.speechSynthesis.speak(utterance);
    }
  };  

  // 화면이 처음 렌더링될 때 환영 인사 음성 출력
  useEffect(() => {
    speakWelcome();
  }, []);

  // 컴포넌트 내부에서 오디오 객체 선언
const bgmAudio = useRef(new Audio('/bgm.mp3'));
const soundEffectRef = useRef(new Audio('/success.mp3')); // 👈 효과음 useRef 추가

// 1. 컴포넌트가 처음 뜰 때 BGM 설정 (반복 재생 및 30% 볼륨)
useEffect(() => {
  bgmAudio.current.loop = true; // 반복 재생 설정
  bgmAudio.current.volume = 0.2; // 👈 20% 크기로 은은하게 설정
}, []);

// 퀴즈 진행 단계에 따른 BGM 재생/정지
useEffect(() => {
  if (step === 'quiz') {
    bgmAudio.current.play().catch(err => console.log("BGM 재생 오류:", err));
  } else {
    bgmAudio.current.pause();
    bgmAudio.current.currentTime = 0;
  }
}, [step]);


  // 초기화 (질문 10개 랜덤 세팅)
  useEffect(() => {
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
  }, []);

  // 이름 입력 완료
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (docentName.trim() === '') return;
    setStep('quiz');
  };

  // 퀴즈 응답 처리
  const handleAnswer = (choice, tags) => {
    const newAnswers = [...answers, { q: questions[currentQIndex].q, choice, tags }];
    setAnswers(newAnswers);

    if (currentQIndex < 9) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // 10번 문항을 마치고 넘어가는 순간 효과음 재생 및 로딩 전환
      soundEffectRef.current.currentTime = 0; // 재생 위치를 처음으로 초기화
      soundEffect.volume = 0.4; // 효과음 볼륨 40%
      soundEffect.play().catch(e => console.log(e));

      setStep('loading');
      generateAIResult(newAnswers);
    }
  };

  // Gemini API 호출 로직
  const generateAIResult = async (finalAnswers) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      alert("API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.");
      setStep('intro');
      return;
    }

    const analysisData = finalAnswers.map((a, i) => `${i+1}. 질문: ${a.q}\n선택성향태그: ${a.tags}`).join('\n\n');

    const prompt = `
      당신은 인천 제물포구 개항장 역사문화 해설사를 위한 전문 AI 분석가입니다.
      해설사님의 이름(호칭)은 '${docentName}'입니다.
      아래는 이 해설사님이 10개의 밸런스 게임에서 선택한 결과와 그에 따른 성향 태그입니다.
      - 나의 해설사 성향 설명은 핵심을 담아 딱 3문장으로 작성해주세요.
      - 각 문장은 줄바꿈 기호(\n\n)를 이용해 각각 독립된 단락으로 나누어 가독성 좋게 출력해주세요.


      [선택 데이터]
      ${analysisData}

      위 데이터를 종합적으로 분석하여 반드시 아래의 JSON 형식으로만 응답해주세요. 
      마크다운 기호(\`\`\`json 등)나 다른 설명은 절대 포함하지 마세요.

      {
        "analysis": "10개의 선택을 종합하여 해설사님의 성향, 취향, 해설 스타일을 분석하는 따뜻한 글. (반드시 '${docentName}'이라는 호칭을 사용하고, 존댓말로 작성)",
        "imagePrompt": "A highly creative and unique artistic portrait of a docent in 19th-century Incheon Open Port, dynamically styled with varying artistic mediums like vintage oil painting, soft watercolor, or modern digital illustration based on the user's personality, rich background details, beautiful lighting.",
        "contents": [
          {
            "title": "기억하기 쉽고 창의적인 콘텐츠 제목 (예: 개항장 골목길 ASMR)",
            "type": "콘텐츠 형태 (예: 오디오 해설, AI 숏폼 영상 등)",
            "description": "무엇을 어떻게 만드는지 구체적인 설명",
            "reason": "왜 ${docentName}님에게 이 콘텐츠를 추천하는지 (선택 데이터와 연관지어 설명)",
            "howToAi": "생성형 AI를 어떻게 활용해서 만들지 안내"
          }
        ]
      }
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      const data = await response.json();
      
      let textContent = data.candidates[0].content.parts[0].text;
      textContent = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedData = JSON.parse(textContent);
      setResultData(parsedData);
      setStep('result');

    } catch (error) {
      console.error("AI Error:", error);
      alert("결과를 분석하는 중 오류가 발생했습니다. API 키 연결을 확인해주세요.");
      setStep('intro');
      setAnswers([]);
      setCurrentQIndex(0);
    }
  };

  // 처음부터 다시하기
  const resetApp = () => {
    // 👈 다시하기를 누르는 순간 BGM과 효과음 모두 즉시 정지!
    bgmAudio.current.pause();
    bgmAudio.current.currentTime = 0;

    soundEffectRef.current.pause();
    soundEffectRef.current.currentTime = 0;
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setAnswers([]);
    setCurrentQIndex(0);
    setResultData(null);
    setStep('intro');
    setDocentName('');
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <Map className="w-16 h-16 text-amber-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">개항장 해설사<br/>AI 성향 분석기</h1>
          <p className="text-gray-600 mb-8 text-sm">
            10개의 재미있는 밸런스 게임으로<br/>나의 해설 취향을 알아보고,<br/>맞춤형 AI 콘텐츠 아이디어를 받아보세요!
          </p>
          <button 
            onClick={() => setStep('name')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center"
          >
            시작하기 <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'name') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">안녕하세요. 반갑습니다!</h2>
          <p className="text-gray-600 mb-6 font-medium">뭐라고 불러드리면 좋을까요?<br/><span className="text-sm font-normal text-gray-400">(예: 해설사님, 김선생님, 앨리스님)</span></p>
          
          <form onSubmit={handleNameSubmit}>
            <input 
              type="text" 
              value={docentName}
              onChange={(e) => setDocentName(e.target.value)}
              placeholder="호칭을 입력해주세요"
              className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!docentName.trim()}
              className="w-full bg-amber-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all"
            >
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const currentQ = questions[currentQIndex];
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
              {currentQ.category}
            </span>
            <span className="text-gray-400 text-sm font-medium">
              {String(currentQIndex + 1).padStart(2, '0')} / 10
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 mb-8 leading-tight px-2 break-keep">
            <span className="text-amber-600 mr-2">Q.</span>
            {currentQ.q}
          </h2>

          <div className="space-y-4">
            <button 
              onClick={() => handleAnswer(currentQ.a, currentQ.tagsA)}
              onMouseUp={(e) => e.target.blur()}
              className="w-full bg-white hover:bg-amber-50 border-2 border-transparent hover:border-amber-300 text-gray-700 font-medium py-6 px-6 rounded-2xl shadow-sm transition-all text-left break-keep text-lg"
            >
              {currentQ.a}
            </button>
            <button 
              onClick={() => handleAnswer(currentQ.b, currentQ.tagsB)}
              onMouseUp={(e) => e.target.blur()}
              className="w-full bg-white hover:bg-amber-50 border-2 border-transparent hover:border-amber-300 text-gray-700 font-medium py-6 px-6 rounded-2xl shadow-sm transition-all text-left break-keep text-lg"
            >
              {currentQ.b}
            </button>
            <div className="pt-4 text-center">
              <button 
                onClick={() => handleAnswer('둘 다 좋아요', `${currentQ.tagsA}, ${currentQ.tagsB}, 복합적`)}
                className="text-gray-400 hover:text-amber-600 text-sm font-medium underline underline-offset-4 p-2 transition-colors"
              >
                모두 품고 싶어요
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <Sparkles className="w-12 h-12 text-amber-600 animate-pulse mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">분석 중입니다...</h2>
        <p className="text-gray-600 leading-relaxed">
          <span className="font-bold text-amber-700">{docentName}</span>님의 10가지 선택을 바탕으로<br/>AI가 성향과 맞춤 콘텐츠를 고민하고 있어요.
        </p>
      </div>
    );
  }

  if (step === 'result' && resultData) {
    const randomSeed = Math.floor(Math.random() * 1000000); // 👈 매번 다른 이미지가 나오게 하는 랜덤 시드
    const encodedPrompt = encodeURIComponent(resultData.imagePrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=1024&height=1024&seed=${randomSeed}&nologo=true`; // 👈 model=flux와 seed 추가

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-amber-600 text-white p-6 pt-12 pb-8 rounded-b-3xl shadow-md">
          <h1 className="text-2xl font-bold mb-2">분석이 완료되었습니다! 🎉</h1>
          <p className="opacity-90">{docentName}님만을 위한 개항장 맞춤 리포트입니다.</p>
        </div>

        <div className="p-4 max-w-md mx-auto space-y-6 -mt-4">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-amber-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">나의 해설사 성향</h2>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line break-keep">
              {resultData.analysis}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <ImageIcon className="w-6 h-6 text-amber-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">AI가 상상한 나의 모습</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              선택하신 취향을 바탕으로 AI가 그려낸 19세기 제물포에서의 모습입니다.
            </p>
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 relative shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
                이미지를 불러오고 있습니다...
              </div>
              <img 
                src={imageUrl} 
                alt="AI Generated Portrait" 
                className="w-full h-full object-cover relative z-10"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-6 h-6 text-amber-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">추천 AI 창작 콘텐츠</h2>
            </div>
            
            <div className="space-y-6">
              {resultData.contents.map((content, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <span className="inline-block bg-amber-300 text-amber-950 text-xs font-bold border-2 border-amber-500 shadow-md px-4 py-1.5 rounded-full mb-3">
                    {content.type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{content.title}</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-gray-700">설명:</strong> <span className="text-gray-600">{content.description}</span></p>
                    <p><strong className="text-gray-700">추천 이유:</strong> <span className="text-gray-600">{content.reason}</span></p>
                    <div className="bg-amber-50 p-4 rounded-xl mt-4 text-xs text-gray-700 border border-amber-100">
                      <strong className="text-amber-800 flex items-center mb-2">
                        <Sparkles className="w-4 h-4 mr-1"/> AI 활용 팁
                      </strong>
                      <span className="leading-relaxed">{content.howToAi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={resetApp}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center mt-8"
          >
            <RefreshCcw className="w-5 h-5 mr-2" /> 처음부터 다시하기
          </button>
        </div>
      </div>
    );
  }

  return null;
}
