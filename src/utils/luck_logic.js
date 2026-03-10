export const DEFAULT_WISH_TREE = {
    wealth: {
        id: 'wealth',
        label: '재물/사업 (Wealth)',
        icon: '💰',
        color: 'text-yellow-400',
        visual: {
            concept: "황금빛 흐름 (Golden Flow)",
            prompt: "A high-end digital talisman, glowing with golden energy lines, symbolizing wealth and prosperity, mystic geometric patterns, 8k resolution, cinematic lighting --ar 9:16",
            bgGradient: ['#1a1200', '#5c4d00', '#FFD700'],
            accent: '#FFD700'
        },
        items: [
            { id: 'business', label: '사업/창업 (Business)', desc: '성공, 투자, 거래' },
            { id: 'asset', label: '자산 증식 (Asset)', desc: '투자 수익, 횡재' },
            { id: 'career', label: '직장/커리어 (Career)', desc: '승진, 이직, 연봉' }
        ]
    },
    relationship: {
        id: 'relationship',
        label: '인연/관계 (Social)',
        icon: '🤝',
        color: 'text-pink-400',
        visual: {
            concept: "따뜻한 연결 (Warm Light)",
            prompt: "A digital amulet representing social connection and love, warm pink and orange gradients, soft glowing threads connecting points, harmonious design, 8k --ar 9:16",
            bgGradient: ['#1a0505', '#5c1010', '#FF6B6B'],
            accent: '#FF6B6B'
        },
        items: [
            { id: 'love', label: '애정/결혼 (Love)', desc: '새 인연, 관계 회복' },
            { id: 'social', label: '귀인/인맥 (Network)', desc: '파트너, 조력자' },
            { id: 'human', label: '대인 관계 (Harmony)', desc: '신뢰, 구설수 방지' }
        ]
    },
    health: {
        id: 'health',
        label: '건강/멘탈 (Health)',
        icon: '🌿',
        color: 'text-green-400',
        visual: {
            concept: "생명력의 빛 (Vital Green)",
            prompt: "A digital healing seal, vibrant green and teal energy, organic nature-inspired patterns, overflowing vitality, restorative atmosphere, 8k --ar 9:16",
            bgGradient: ['#001a0a', '#004d26', '#4ECDC4'],
            accent: '#4ECDC4'
        },
        items: [
            { id: 'energy', label: '에너지 회복 (Energy)', desc: '활력, 숙면' },
            { id: 'mind', label: '마음 챙김 (Mind)', desc: '스트레스, 평정심' },
            { id: 'body', label: '신체 안녕 (Body)', desc: '쾌유, 다이어트' }
        ]
    },
    achievement: {
        id: 'achievement',
        label: '학업/명예 (Honor)',
        icon: '🎓',
        color: 'text-blue-400',
        visual: {
            concept: "상승하는 불꽃 (Rising Flame)",
            prompt: "A digital emblem of success, rising flames of blue and purple fire, sharp dynamic lines, ascending energy, powerful and majestic, 8k --ar 9:16",
            bgGradient: ['#05051a', '#10105c', '#6A5ACD'],
            accent: '#60A5FA'
        },
        items: [
            { id: 'exam', label: '시험/합격 (Exam)', desc: '고시, 자격증' },
            { id: 'art', label: '창작/예술 (Art)', desc: '영감, 수상' },
            { id: 'fame', label: '명예/인정 (Fame)', desc: '영향력, 브랜드' }
        ]
    },
    creator: {
        id: 'creator',
        label: '크리에이터 (Creator)',
        icon: '🎬',
        color: 'text-purple-400',
        visual: {
            concept: "무한한 확산 (Viral Wave)",
            prompt: "A digital talisman for content creators, neon purple and pink glitch art aesthetics, viral energy waves, spotlight effects, 8k --ar 9:16",
            bgGradient: ['#1a0529', '#3d0a5e', '#D500F9'],
            accent: '#D500F9'
        },
        items: [
            { id: 'youtube', label: '유튜브 (YouTube)', desc: '구독자, 조회수, 떡상' },
            { id: 'instagram', label: '인스타그램 (Instagram)', desc: '팔로워, 좋아요, 인플루언서' },
            { id: 'tiktok', label: '틱톡 (TikTok)', desc: '숏폼 바이럴, 트렌드' }
        ]
    }
};

// State Management
const STORAGE_KEY = 'GAEWOON_WISH_TREE_V2';

export const getActiveWishTree = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            let tree = JSON.parse(stored);

            // --- AUTO MIGRATION / SELF-HEALING ---
            // Fix Color for Achievement (Honor) if it's the old gray
            if (tree.achievement && tree.achievement.visual && tree.achievement.visual.accent === '#9FA8DA') {
                tree.achievement.visual.accent = '#60A5FA';
                localStorage.setItem(STORAGE_KEY, JSON.stringify(tree)); // Save immediately
            }
            // -------------------------------------

            return tree;
        }
    } catch (e) {
        console.error("Failed to load wish tree", e);
    }
    return DEFAULT_WISH_TREE;
};

export const saveWishTree = (newTree) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTree));
        // Force reload or event dispatch could go here.
        // For simple React apps without Context, window reload might be needed 
        // OR we dispatch a custom event that components listen to.
        window.dispatchEvent(new Event('wishTreeUpdated'));
    } catch (e) {
        console.error("Failed to save wish tree", e);
    }
};

export const resetWishTree = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('wishTreeUpdated'));
};


export const generateLuckAction = (categoryId, subCategoryId, userName) => {
    // Note: This function relies on static logic. 
    // If users Add New Categories, this function needs to be generic or updated dynamically.
    // For now, we fallback to a generic action if category is unknown.

    const tree = getActiveWishTree();
    const category = tree[categoryId];

    // ... existing logic but maybe simplified or generic fallback ...
    // Since implementing a dynamic rule engine is complex, we keep the hardcoded logic for default categories
    // and add a Generic Handler for new ones.

    // Copied from previous logic (keeping it intact for now, but conceptually this should also be dynamic)
    // For brevity, I am keeping the logic structure but ensure it doesn't crash on new IDs.

    let action = {
        title: "운의 기본기 다지기",
        reasoning: "운은 준비된 자에게 옵니다. 주변을 정리하세요.",
        doing: "책상 정리 및 환기 10분",
        telling: "친구에게 '나 지금 정리 중!' 인증샷 보내기"
    };

    if (categoryId === 'wealth') {
        if (subCategoryId === 'business') {
            action = { title: "시장(Market)의 틈새 포착", reasoning: "사업운은 관찰에서 시작됩니다.", doing: "불편한 점 3가지 메모하기", telling: "동료에게 의견 묻기" };
        } else if (subCategoryId === 'asset') {
            action = { title: "부의 흐름 읽기", reasoning: "돈은 관심을 따릅니다.", doing: "경제 뉴스 헤드라인 5개 정독", telling: "친구에게 정보 공유" };
        } else {
            action = { title: "프로페셔널 임팩트", reasoning: "인정은 태도에서 옵니다.", doing: "성과 수치로 정리하기", telling: "팀에 공유하기" };
        }
    } else if (categoryId === 'relationship') {
        if (subCategoryId === 'love') {
            action = { title: "매력 발산", reasoning: "문을 여세요.", doing: "거울 보고 미소 3번", telling: "SNS에 밝은 사진 올리기" };
        } else if (subCategoryId === 'social') {
            action = { title: "귀인 호출", reasoning: "도울 준비가 되었을 때 나타납니다.", doing: "오랜 지인에게 안부 연락", telling: "관심사 공유하기" };
        } else {
            action = { title: "관계 디톡스", reasoning: "감정의 찌꺼기를 비우세요.", doing: "역지사지 명상", telling: "고맙다는 말 하기" };
        }
    } else if (categoryId === 'health') {
        action = { title: "활력 충전", reasoning: "육체가 건강해야 합니다.", doing: "햇볕 쬐며 15분 걷기", telling: "운동 완료 인증" };
    } else if (categoryId === 'achievement') {
        if (subCategoryId === 'exam') {
            action = { title: "몰입의 점화", reasoning: "확신을 가지세요.", doing: "50분 집중 공부", telling: "목표 달성 공유" };
        } else {
            action = { title: "영감 채집", reasoning: "다른 시선을 가지세요.", doing: "롤모델 분석", telling: "인사이트 기록" };
        }
    } else if (categoryId === 'creator') {
        if (subCategoryId === 'youtube') {
            action = { title: "알고리즘 간택", reasoning: "시선을 끄세요.", doing: "썸네일 벤치마킹", telling: "스포일러 공유" };
        } else if (subCategoryId === 'instagram') {
            action = { title: "비주얼 오라", reasoning: "동경을 파세요.", doing: "인생샷 건지기", telling: "스토리 소통" };
        } else {
            action = { title: "바이럴 웨이브", reasoning: "흐름을 타세요.", doing: "트렌드 오디오 저장", telling: "비하인드 업로드" };
        }
    } else {
        // Generic Action for Custom Categories
        action = {
            title: "새로운 기원의 시작",
            reasoning: "자신만의 길을 개척하는 운입니다.",
            doing: `나만의 ${category ? category.label : '목표'}를 위한 작은 실천 1가지`,
            telling: "나의 새로운 다짐을 선언하기"
        };
    }

    return action;
};
