import { MockMethod } from 'vite-plugin-mock'

let userSeq = 4
let workSeq = 3

let users = [
  {
    id: 1,
    penName: '江来',
    genre: '科幻',
    words: 8000,
    status: 'Active',
    updatedAt: '2025-11-10 10:00'
  },
  {
    id: 2,
    penName: '冷星尘',
    genre: '仙侠',
    words: 6000,
    status: 'Draft',
    updatedAt: '2025-11-09 22:18'
  },
  {
    id: 3,
    penName: 'Beta-Reader 团队',
    genre: '都市',
    words: 0,
    status: 'Active',
    updatedAt: '2025-11-08 14:33'
  }
]

let works = [
  {
    id: 1,
    title: '《星环猎手》· 第十二章',
    category: '连载章节',
    description: '主角潜入废弃太空港，揭露议会阴谋。',
    sizeLabel: '32 KB',
    status: '已入库',
    updatedAt: '2025-11-09 19:20'
  },
  {
    id: 2,
    title: '角色设定 · 江来',
    category: '角色设定',
    description: 'AI 驱动的身世谜底。',
    sizeLabel: '12 KB',
    status: '草稿',
    updatedAt: '2025-11-08 09:40'
  }
]

const analysisResult = {
  sample: '地底赛博城 · 终局',
  summary:
    '文本呈现层层推进的危机感，AI 船舰与灵能修士的联盟构建到位，建议加强团队分工与高潮对照镜头。',
  keywords: [
    { word: '宿命偏移', weight: 0.92 },
    { word: '羁绊共鸣', weight: 0.83 },
    { word: '环轨都市', weight: 0.77 },
    { word: '量子书库', weight: 0.65 }
  ],
  sentiments: [
    { label: '热血', score: 86 },
    { label: '悬疑', score: 70 },
    { label: '悲壮', score: 55 }
  ],
  characters: [
    {
      name: '江来',
      archetype: '成长型主角',
      highlight: '在绝境中协调 AI & 修士体系，完成领导者转变。',
      trend: '+12% 热度'
    },
    {
      name: '鹤芯议长',
      archetype: '反派 / 理想主义',
      highlight: '提出「重构世界算法」的计划，情感动机充足。',
      trend: '风险建议：增加弱点描写'
    }
  ],
  timeline: [
    { label: '冲突引子', detail: '队伍发现天幕条例漏洞，决定潜入量子书库。' },
    { label: '中段提升', detail: '角色间出现立场分歧，引发二次高潮。' },
    { label: '终局', detail: '主角完成自我牺牲的伪命题，呼应世界观。' }
  ],
  metrics: {
    节奏控制: 84,
    情绪递进: 79,
    设定一致性: 91
  }
}

const formatWork = (payload) => {
  const sizeKb = payload.size ? `${Math.round(payload.size / 1024)} KB` : '--'
  return {
    id: workSeq++,
    title: payload.title || payload.fileName,
    category: payload.category || '连载章节',
    description: payload.description || '上传自 mock 接口',
    sizeLabel: sizeKb,
    status: '已入库',
    updatedAt: new Date().toLocaleString()
  }
}

/** @type {MockMethod[]} */
const mocks = [
  {
    url: '/api/user/list',
    method: 'get',
    response: () => ({
      code: 0,
      data: users,
      message: 'mock users loaded'
    })
  },
  {
    url: '/api/user/add',
    method: 'post',
    response: ({ body }) => {
      const payload = body || {}
      if (payload.id) {
        users = users.map((user) => (user.id === payload.id ? { ...user, ...payload } : user))
        return { code: 0, data: payload, message: 'updated' }
      }
      const newUser = {
        id: userSeq++,
        penName: payload.penName || `创作者 ${userSeq}`,
        genre: payload.genre || '科幻',
        words: payload.words || 4000,
        status: payload.status || 'Active',
        updatedAt: new Date().toLocaleString()
      }
      users = [newUser, ...users]
      return { code: 0, data: newUser, message: 'created' }
    }
  },
  {
    url: '/api/work/list',
    method: 'get',
    response: () => ({
      code: 0,
      data: works,
      message: 'mock works loaded'
    })
  },
  {
    url: '/api/work/upload',
    method: 'post',
    response: ({ body }) => {
      const newWork = formatWork(body || {})
      works = [newWork, ...works]
      return { code: 0, data: newWork, message: 'uploaded' }
    }
  },
  {
    url: '/api/analyze/result',
    method: 'get',
    response: () => ({
      code: 0,
      data: analysisResult,
      message: 'analysis mock ready'
    })
  }
] 

export default mocks
