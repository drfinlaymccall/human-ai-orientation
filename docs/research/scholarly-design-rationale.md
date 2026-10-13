# Scholarly rationale for Human AI Orientation

Prepared 13 October 2026. This is a focused design rationale based on selected primary literature and Finlay's stated framework, not a systematic literature review. It informs implementation and the later portfolio write-up. The course's effectiveness still needs evaluation.

## What kind of course and design is this?

The subject is introductory AI literacy and purposeful collaboration. Instructional design is how the experience is constructed; a professional course about instructional design would require substantially more content and assessment. The orientation introduces human capacities that can later support curriculum design with an agent.

The preferred description is **a needs-led, task-based human AI orientation grounded in Finlay's curriculum and course-design research, with explicit support for metacognition and self-evaluation**. Curriculum design supplies the organising rationale; instructional-design models support development. The experience prepares people to participate in later human–agent curriculum work.

Finlay's needs → content → evaluation → execution loop is a project-specific organising adaptation. Its relations to established work are explained below. Calling it an adaptation does not establish that the four-stage formulation is historically unique; no priority claim is made.

## Primary lineage: the thesis and Human Agent Curriculum Design

The primary foundation is McCall's (2025) *Anticipating curriculum and course design for human–AI collaboration*, especially section 2.4.2, its five-domain framework, and Appendix B. The thesis conceptualises curriculum as both participatively produced artefacts and a dynamic relationship between planning, enactment and evaluation. Its account of Graves and Richards connects course design to context and interacting decisions. Orientation adopts this stance, with a modest backward-design commitment to useful exit capabilities and room for learners' needs to change through practice. [Thesis, printed pp. 46–54, 60](https://doi.org/10.26191/sv24-fj56).

The table distinguishes the thesis's intellectual sources from our interpretation. References to the earlier authors here are **through McCall's discussion**; their original works were not newly inspected in this pass.

| Curriculum lineage in the thesis | Application to orientation |
| --- | --- |
| Graves (2000, 2007) and Richards (2013, 2017): interrelated course-design processes, context, and forward/central/backward design | Start with a useful destination, invite learner choices, and revise tasks and goals from experience; avoid a fixed catalogue of AI features |
| Brown (2016), Graves and Richards: needs analysis involves contexts, interests, constraints and judgement | Ask what matters, what is already possible and what would help; do not diagnose all entrants as lacking confidence |
| Schwab (1971) and van den Akker: selective use of theory and coherence between curriculum decisions | Explain why a method fits this learner/task; check that aims, content, support, assessment and delivery agree |
| Posner and Rudnitsky (2006): course rationale makes values and educational purposes explicit | State learner agency, usefulness, portability and human judgement as reasons for design choices |
| McCall's framework, printed p. 60: system boundaries, educational needs, design, content, evaluation/assessment | Keep rationale and boundaries explicit around the four practical pillars. The four-pillar loop is a later simplification, not the thesis framework verbatim |
| Appendix B, printed pp. 287–290: autonomy, reciprocal teaching/learning, responsive needs, sequencing, contextual knowledge and evaluation | Prepare the human to guide an agent, select context, check work and recognise a next learning need. These are adaptations of principles developed for a different application domain |

The current Human Agent Curriculum Design documentation reinforces this interpretation. `docs/52-synthesis-of-educational-philosophies.md` explicitly adopts pragmatist and constructivist commitments, while `docs/site/concepts/4.3-curriculum-lifecycle.md` describes iteration and routing evidence back into earlier decisions. In orientation, these become useful tasks, explanation and scaffolded practice, reflection, and revision. The source repository's design-based research ambitions do not automatically make this course a design-based research study.

**Source boundary:** the thesis concerns human–AI swarm-shepherding teams; orientation is a new audience and enactment. Its principles inform this design but do not establish this course's effectiveness. Likewise, the current repository describes a broader operational lifecycle, not an exact four-stage model. Source locations inspected read-only: `/home/finlay/human-agent-curriculum-design/docs/52-synthesis-of-educational-philosophies.md`, `docs/01-concept.md`, and `docs/site/concepts/4.3-curriculum-lifecycle.md`.

## Revised Bloom: knowledge, thinking and metacognitive awareness

Use the revised taxonomy's **two dimensions**: factual, conceptual, procedural and metacognitive knowledge; and remember, understand, apply, analyse, evaluate and create. Metacognitive knowledge includes strategies, when strategies suit a task, and knowledge of one's own learning. These distinctions inform our outcome/task/evidence map. [Krathwohl, 2002, pp. 214–215](https://www.psychology.mcmaster.ca/bennett/psy720/readings/m1/m1r1.pdf).

This is already part of Finlay's research lineage. Appendix B begins its revised-Bloom mapping at printed p. 291; printed pp. 296–299 address strategic knowledge, contextual judgement and self-knowledge, including self-assessment accuracy and judging a task's usefulness. We adapt that treatment to the human learner, without inferring that models have human metacognition. [McCall, 2025, Appendix B](https://doi.org/10.26191/sv24-fj56).

| Existing activity | Knowledge and thinking to elicit | Small piece of learner evidence |
| --- | --- | --- |
| Do one useful thing | Understand the task; apply an interaction strategy; notice existing strengths and uncertainty | Explain why this task matters and what help is needed |
| Give useful context | Understand how supplied context differs from saved instructions; analyse relevance; create a short personal/project brief | Explain one inclusion, one omission and when the instruction should apply |
| Check, improve and continue | Evaluate against a criterion; revise guidance; identify a strategy worth reusing or changing | Point to a result, explain the judgement, and name what to do differently next time |

These are overlapping uses, not a prescribed six-step ladder. Creating a simple brief does not demonstrate expert-level performance. Keep tasks small and supported. Bloom helps classify intended learning; it does not supply a teaching method or prove learning occurred. Zimmerman and formative-feedback research below help turn awareness into planning, monitoring and action.

For the context portfolio, prompt: “What did I expect? What happened? What did I change, and why? What would I check or do differently next time?” An AI may help draft an instruction file, but the learner's selection, explanation and revision provide the relevant evidence. A polished AI-generated file alone cannot show metacognitive growth.

## ADDIE and Dick, Carey and Carey

These are supporting process references, subordinate to the curriculum-design lineage above.

**ADDIE provides a development scaffold.** Branch (2009) presents analysis, design, development, implementation and evaluation as an adaptable product-development paradigm. Here, learner discovery informs outcomes; content and platform work develop the experience; pilot delivery enables revision. Our four learner-facing pillars do not map one-to-one onto those five functions. In particular, selecting knowledge is different from developing the entire course, and evaluation has work to do before, during and after delivery. We can say the process is *informed by ADDIE*, provided those functions are actually documented. [Branch, 2009](https://link.springer.com/chapter/10.1007/978-0-387-09506-6_1).

**Dick, Carey and Carey provide more detailed systems-design discipline.** Their model connects goal and learner analysis, performance objectives, assessment, instructional strategy, materials, formative evaluation and revision. Borrow the traceability: for every promised capability, identify the learner task and evidence that would support it. The present brief does not yet perform a complete instructional analysis or implement all model components, so describe it as *informed by the systems approach*, rather than a full application of the model. This is a proportionate adoption for the MVP, not a judgement that the model is inherently inflexible. [Dick, Carey, & Carey, 2022](https://www.pearson.com/en-us/subject-catalog/p/systematic-design-of-instruction-the/P200000000952/9780137510344).

## The central pedagogical commitments

**Constructive alignment supplies the coherence test.** Biggs (1996) links intended performances of understanding, learning activities and assessment. Our translation is simple: if the outcome is selecting helpful context, learners must select context and explain its use; a vocabulary quiz cannot stand in for that performance. A needs/outcome/task/evidence table should accompany the three activities. [Biggs, 1996](https://doi.org/10.1007/BF00138871).

**Merrill gives the practical activity pattern.** His first principles foreground real problems, activation of prior knowledge, demonstration, application and integration. This supports a relevant task with an explanation and worked example, guided use of the learner's own AI, and reuse in their own setting. It also supports showing help before asking learners to experiment. The 2002 paper synthesises principles across instructional theories; it explicitly does not itself establish their empirical support. Use it as a design rationale, not a guarantee of results. [Merrill, 2002, pp. 43–45](https://mdavidmerrill.files.wordpress.com/2019/04/firstprinciplesbymerrill.pdf).

**Self-regulated learning explains the human capacities.** Zimmerman (2002) describes a cycle of forethought, performance and self-reflection. That is a strong theoretical fit for learners setting a small goal, monitoring an interaction, judging their progress and adapting their approach. It is broader than “work independently”: help-seeking and supported practice remain appropriate. Our application concerns everyday AI use, whereas the paper principally discusses learning and academic performance; transfer is a design decision requiring evaluation. [Zimmerman, 2002, especially pp. 67–69](https://doi.org/10.1207/s15430421tip4102_2).

**Formative feedback makes self-evaluation actionable.** Nicol and Macfarlane-Dick (2006) position learners as active generators and interpreters of feedback. Use a visible success criterion, an example, comparison with an attempt, and a chance to revise. Self-access delivery therefore still allows formative assessment. Asking “how confident are you?” provides different evidence from asking someone to show what they checked. AI feedback can contribute to the exercise, but course completion should not depend on an unverified model judgement. [Nicol & Macfarlane-Dick, 2006](https://strathprints.strath.ac.uk/3235/).

## Communication, knowledge and AI-specific adaptation

**Task-based and communicative traditions explain purposeful interaction.** Ellis (2014) discusses meaning-focused language use and several forms of task-based language teaching. We adapt that orientation to communicating an intention, supplying missing information, clarifying a misunderstanding and achieving a useful outcome. This is not a second-language course, and language-acquisition findings do not by themselves validate human–AI interaction. “Task-based learning informed by communicative language teaching” is more accurate than claiming a complete TBLT curriculum. [Ellis, 2014, pp. 103–106](https://fass.nus.edu.sg/cls/wp-content/uploads/sites/32/2020/10/ellis_rod.pdf).

**Laurillard helps frame technology-mediated learning as design work.** Her account connects evidence-informed teaching with making and sharing pedagogical designs, and considers acquisition, inquiry, discussion, practice and collaboration. We draw on that framing to combine explanation, examination of material, a practical attempt and reflection, then document what worked. Selecting and briefly synthesising useful material is our concrete interpretation of inquiry here. We should not equate a chatbot exchange with the full Conversational Framework or assume an AI performs the pedagogical role of a human teacher. [Laurillard, 2012](https://www.routledge.com/Teaching-as-a-Design-Science-Building-Pedagogical-Patterns-for-Learning-and-Technology/Laurillard/p/book/9780415803878).

**AI literacy defines the domain.** Long and Magerko (2020) connect critical evaluation, communication and collaboration with AI, and practical use. Their framework explicitly does not require programming for everyday AI literacy. It supports the course's non-specialist audience and balance of practical use and judgement. It predates today's generative-AI interfaces: memories, project context, modalities and tool permissions require current product guidance, not attribution to this paper. [Long & Magerko, 2020](https://doi.org/10.1145/3313831.3376727).

The thesis provides the primary curriculum lineage set out above. These additional accounts support particular design decisions rather than replace that foundation.

## Mapping the four pillars without forcing equivalence

| Project pillar | Scholarly connection | Evidence to collect in orientation |
| --- | --- | --- |
| Needs | Learner/context analysis; self-regulated forethought and self-assessment | A goal and a named area where help or learning is needed |
| Content and knowledge | Prior-knowledge activation; inquiry and selection of relevant material | A relevant example or source, a reason for selecting it, and a short synthesis |
| Assessment and evaluation | Constructive alignment; formative feedback and self-reflection | A criterion stated before the task, a checked result, and an explanation of a revision |
| Execution | Guided application; monitoring and adaptation during performance | The human briefs, guides, checks and adjusts the interaction, then identifies a next step |

These are functional connections, not claims that any author proposed our four-part loop. Humans initially carry out the teaching/execution role; assigning that role to the later teaching agent is part of Finlay's broader design proposition. Human-learning theories do not establish that a model learns in the same way, or that supplying context permanently trains it.

## What this changes in the three-activity MVP

1. **Useful task:** begin with a small goal and an initial self-assessment; show a worked example; agree one criterion; provide a guided attempt. Capture both the result and the learner's interpretation.
2. **Context brief:** select a relevant note or example, consider its limitations, put the useful information into a short brief, and compare an interaction with and without that context. Avoid attributing all differences to the context: model outputs vary.
3. **Check and continue:** use the criterion to inspect and revise a result; ask the learner to explain their decision; reuse the approach with a next goal and retained context. Their own judgement remains visible even when the AI helps draft it.

This introduces small opportunities to practise the capacities across the existing activities. It does not add theory modules or demand mastery of source evaluation, synthesis, or assessment design.

## Wording for the later write-up

> Human AI Orientation extends my research on curriculum and course design for human–AI collaboration into a practical entry experience for non-AI specialists. It treats needs, knowledge, activity and evaluation as interdependent design decisions, responsive to learners' contexts. Constructive alignment connects intended capabilities with tasks and evidence. The revised Bloom taxonomy informs attention to conceptual, procedural and metacognitive knowledge, while guided practice, reflection and formative feedback support self-evaluation. Learners develop and test a personal context portfolio and reusable guidance for their agents, preparing them for later collaborative curriculum work.

This is original draft wording about the intended design. At publication, link each claimed influence to implemented material. Report findings separately. Weekly product improvement should be called iterative development and formative evaluation unless the project actually adopts a documented design-based research methodology. Synthetic persona walkthroughs provide testing observations, not human-learning data.

## References and source verification

The references below identify the works used, with access limits stated so later writing can be checked efficiently. No material was added to or changed in Zotero.

1. Branch, R. M. (2009). *Instructional design: The ADDIE approach*. Springer. [Book DOI](https://doi.org/10.1007/978-0-387-09506-6). Read: publisher's prologue abstract, not the complete book.
2. Dick, W., Carey, L., & Carey, J. O. (2022). *The systematic design of instruction* (9th ed.). Pearson. [Publisher](https://www.pearson.com/en-us/subject-catalog/p/systematic-design-of-instruction-the/P200000000952/9780137510344). Read: publisher overview and contents. The page records release in June 2021 and copyright 2022; this reference uses the edition's copyright year. Full chapter-level implementation guidance was not read.
3. Biggs, J. (1996). Enhancing teaching through constructive alignment. *Higher Education, 32*, 347–364. [DOI](https://doi.org/10.1007/BF00138871). Read: publisher abstract and bibliographic record.
4. Merrill, M. D. (2002). First principles of instruction. *Educational Technology Research and Development, 50*(3), 43–59. [Author-hosted paper](https://mdavidmerrill.files.wordpress.com/2019/04/firstprinciplesbymerrill.pdf). Full text retrieved; opening rationale and principles inspected.
5. Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. *Theory Into Practice, 41*(2), 64–70. [DOI](https://doi.org/10.1207/s15430421tip4102_2). Publisher access was blocked; inspected the article text in an [accessible PDF copy](https://www.leiderschapsdomeinen.nl/wp-content/uploads/2016/12/Zimmerman-B.-2002-Becoming-Self-Regulated-Learner.pdf), including the cycle on pp. 67–69.
6. Nicol, D. J., & Macfarlane-Dick, D. (2006). Formative assessment and self-regulated learning: A model and seven principles of good feedback practice. *Studies in Higher Education, 31*(2), 199–218. [DOI](https://doi.org/10.1080/03075070600572090). Read: author-repository record and the opening theoretical account in its [accepted manuscript](https://strathprints.strath.ac.uk/3235/1/nicol-2006-Formative-assessment.pdf). The manuscript says accepted in 2005; publication is 2006.
7. Ellis, R. (2014). Taking the critics to task: The case for task-based teaching. In *Proceedings of CLaSIC 2014* (pp. 103–117). [University-hosted paper](https://fass.nus.edu.sg/cls/wp-content/uploads/sites/32/2020/10/ellis_rod.pdf). Full text retrieved; opening discussion of task-based approaches inspected. This is distinct from his 2009 paper, which was located but could not be fetched from the publisher.
8. Laurillard, D. (2012). *Teaching as a design science: Building pedagogical patterns for learning and technology*. Routledge. [Publisher](https://www.routledge.com/Teaching-as-a-Design-Science-Building-Pedagogical-Patterns-for-Learning-and-Technology/Laurillard/p/book/9780415803878). Read: publisher description and contents. Zotero item `9CQXZZIB` lists 2013; this rationale uses the publisher's 2012 first-edition year. Verify the particular edition before quoting pages.
9. Long, D., & Magerko, B. (2020). What is AI literacy? Competencies and design considerations. In *Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems* (Paper 598, pp. 1–16). [DOI](https://doi.org/10.1145/3313831.3376727). Publisher access was blocked; read PDF pp. 1–3 through Zotero item `K2KLLGCI`, including the definition and review method.
10. McCall, F. (2025). *Anticipating curriculum and course design for human–AI collaboration* [Doctoral thesis, University of Canberra]. [DOI](https://doi.org/10.26191/sv24-fj56). Read: record and public abstract; targeted full-text inspection through Zotero `S7EIG9TW`: PDF pp. 65–73 (printed 46–54), 79–80 (60–61), 306–310 (287–291), and 314–318 (295–299). Includes the curriculum/course-design account, five-domain framework, twelve principles and selected revised-Bloom discussion. Not a complete thesis review. Check original works and full bibliographic entries before citing the thesis's sources as directly consulted.
11. Krathwohl, D. R. (2002). A revision of Bloom's taxonomy: An overview. *Theory Into Practice, 41*(4), 212–218. [University-hosted article copy](https://www.psychology.mcmaster.ca/bennett/psy720/readings/m1/m1r1.pdf). Full text retrieved; two-dimensional structure, metacognitive categories and hierarchy discussion inspected. This primary overview describes the 2001 revision by Anderson, Krathwohl and colleagues; the complete 2001 volume was not inspected in this pass.

### Relevant follow-up from the existing library

Lämsä, J., & Järvelä, S. (2026). *Augmenting, not outsourcing: Leveraging artificial intelligence to support students' self-regulated learning*. *Theory Into Practice*, advance online publication. [DOI](https://doi.org/10.1080/00405841.2026.2721203). Zotero `LW8TCSHC`; metadata and abstract inspected only. Its focus on eliciting learners' regulation rather than outsourcing it is relevant to our use of AI assistance. Read the full paper before adopting its Trigger Regulation Framework or making claims from its classroom cases.
