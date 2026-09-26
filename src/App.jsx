import React, { useState, useEffect } from 'react';
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
  { id: 'Q12', category: '이야기', q: '가장 마음이 가는 제물포의 풍경은?', a: '밤바다에 정박해 있는 이양선의 불빛', b: '아침 일찍부터 문을 여는 시끌벅적한 우각동 거리', tagsA: '낭만,신비로움,정적인', tagsB: '일상,생활감,동적인' }
];

export default function App() {
  const [step, setStep] = useState('intro'); // intro, name, quiz, loading, result
  const [docentName, setDocentName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultData, setResultData] = useState(null);

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

      [선택 데이터]
      ${analysisData}

      위 데이터를 종합적으로 분석하여 반드시 아래의 JSON 형식으로만 응답해주세요. 
      마크다운 기호(\`\`\`json 등)나 다른 설명은 절대 포함하지 마세요.

      {
        "analysis": "10개의 선택을 종합하여 해설사님의 성향, 취향, 해설 스타일을 분석하는 따뜻한 글. (반드시 '${docentName}'이라는 호칭을 사용하고, 존댓말로 작성)",
        "imagePrompt": "A highly detailed portrait of a docent in 19th-century Jemulpo open port street in Incheon, retro style, cinematic lighting, photorealistic, incorporating the vibe of [여기에 분석된 해설사의 주요 성향을 영어 키워드로 번역해서 3~4개 삽입]. English only.",
        "contents": [
          {
            "title": "기억하기 쉽고 창의적인 콘텐츠 제목 (예: 개항장 골목길 ASMR)",
            "type": "콘텐츠 형태 (예: 오디오 해설, AI 숏폼 영상 등)",
            "description": "무엇을 어떻게 만드는지 구체적인 설명",
            "reason": "왜 ${docentName}님에게 이 콘텐츠를 추천하는지 (선택 데이터와 연관지어 설명)",
            "howToAi": "ChatGPT, Midjourney 등 AI를 어떻게 활용해서 만들지 안내"
          }
        ]
      }
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
              className="w-full bg-white hover:bg-amber-50 border-2 border-transparent hover:border-amber-300 text-gray-700 font-medium py-6 px-6 rounded-2xl shadow-sm transition-all text-left break-keep text-lg"
            >
              {currentQ.a}
            </button>
            <button 
              onClick={() => handleAnswer(currentQ.b, currentQ.tagsB)}
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
    const encodedPrompt = encodeURIComponent(resultData.imagePrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true`;

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
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
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
