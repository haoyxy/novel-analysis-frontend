package samples;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 一个可直接运行的 Java 示例，串起 Controller -> Service -> Repository -> DTO 的调用链，
 * 用于说明即使没有真实数据库，后端逻辑依旧是“可走通”的。
 */
public class NovelAnalysisMockBackend {

    public static void main(String[] args) {
        NovelController controller = new NovelController(new NovelService(new NovelRepository()));

        AnalyzeRequestDTO request = new AnalyzeRequestDTO(
            "江来",
            "地底赛博城 · 终局篇",
            "团队协作、羁绊爆发"
        );

        AnalyzeResultDTO result = controller.triggerAnalysis(request);
        System.out.println(result);
    }
}

class NovelController {
    private final NovelService service;

    public NovelController(NovelService service) {
        this.service = service;
    }

    public AnalyzeResultDTO triggerAnalysis(AnalyzeRequestDTO requestDTO) {
        requestDTO.validate();
        return service.analyzeChapter(requestDTO);
    }
}

class NovelService {
    private final NovelRepository repository;

    public NovelService(NovelRepository repository) {
        this.repository = repository;
    }

    public AnalyzeResultDTO analyzeChapter(AnalyzeRequestDTO requestDTO) {
        repository.saveRequest(requestDTO);

        List<String> keywords = List.of("宿命偏移", "羁绊共鸣", requestDTO.getFocusKeyword());
        double pacingScore = 0.83;
        return new AnalyzeResultDTO(
            requestDTO.getChapterName(),
            keywords,
            pacingScore,
            "Mock: 节奏良好，保持角色互动强度。"
        );
    }
}

class AnalyzeRequestDTO {
    private final String author;
    private final String chapterName;
    private final String focusKeyword;

    public AnalyzeRequestDTO(String author, String chapterName, String focusKeyword) {
        this.author = author;
        this.chapterName = chapterName;
        this.focusKeyword = focusKeyword;
    }

    public String getAuthor() {
        return author;
    }

    public String getChapterName() {
        return chapterName;
    }

    public String getFocusKeyword() {
        return focusKeyword;
    }

    public void validate() {
        if (author == null || author.isBlank()) {
            throw new IllegalArgumentException("author can not be empty");
        }
        if (chapterName == null || chapterName.isBlank()) {
            throw new IllegalArgumentException("chapter name can not be empty");
        }
    }
}

class AnalyzeResultDTO {
    private final String chapterName;
    private final List<String> keywords;
    private final double pacingScore;
    private final String suggestion;

    public AnalyzeResultDTO(String chapterName, List<String> keywords, double pacingScore, String suggestion) {
        this.chapterName = chapterName;
        this.keywords = new ArrayList<>(keywords);
        this.pacingScore = pacingScore;
        this.suggestion = suggestion;
    }

    @Override
    public String toString() {
        return "AnalyzeResultDTO{" +
            "chapterName='" + chapterName + '\'' +
            ", keywords=" + keywords +
            ", pacingScore=" + pacingScore +
            ", suggestion='" + suggestion + '\'' +
            '}';
    }
}

class NovelRepository {
    private final List<String> savedRequests = new CopyOnWriteArrayList<>();

    public void saveRequest(AnalyzeRequestDTO dto) {
        savedRequests.add(dto.getAuthor() + " - " + dto.getChapterName() + " @ " + LocalDateTime.now());
        System.out.println("[Repository] mock saved request, total = " + savedRequests.size());
    }
}
