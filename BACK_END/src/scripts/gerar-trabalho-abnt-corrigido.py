from pathlib import Path

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "documentacao" / "pdfs"
OUTPUTS_DIR = ROOT / "outputs" / "fundamentos da eng de softwere"
PDF_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

output_pdf = PDF_DIR / "trabalho_abnt.pdf"

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CenterTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=18,
        alignment=TA_CENTER,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="CenterText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=18,
        alignment=TA_CENTER,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyJustify",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=18,
        firstLineIndent=1.25 * cm,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="HeadingMain",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=18,
        alignment=TA_LEFT,
        spaceBefore=12,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="ListText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=18,
        leftIndent=0.6 * cm,
        firstLineIndent=0,
        alignment=TA_JUSTIFY,
        spaceAfter=6,
    )
)


class NumberedDoc(SimpleDocTemplate):
    pass


def footer(canvas, doc):
    page = canvas.getPageNumber()
    if page >= 3:
        canvas.setFont("Helvetica", 10)
        canvas.drawRightString(A4[0] - 2 * cm, A4[1] - 1.4 * cm, str(page - 2))


def p(text, style="BodyJustify"):
    return Paragraph(text, styles[style])


def h(text):
    return Paragraph(text, styles["HeadingMain"])


story = []

# Capa
story += [
    p("CENTRO UNIVERSITÁRIO UNIALFA", "CenterTitle"),
    p("CURSO DE ENGENHARIA DE SOFTWARE", "CenterTitle"),
    Spacer(1, 7 * cm),
    p("APLICAÇÃO WEB DE CONTROLE DE GASTOS PESSOAIS", "CenterTitle"),
    Spacer(1, 8 * cm),
    p("Goiânia", "CenterText"),
    p("2026", "CenterText"),
    PageBreak(),
]

# Folha de rosto
story += [
    p("CENTRO UNIVERSITÁRIO UNIALFA", "CenterTitle"),
    p("CURSO DE ENGENHARIA DE SOFTWARE", "CenterTitle"),
    Spacer(1, 5 * cm),
    p("APLICAÇÃO WEB DE CONTROLE DE GASTOS PESSOAIS", "CenterTitle"),
    Spacer(1, 2 * cm),
    Paragraph(
        "Trabalho apresentado ao Centro Universitário UNIALFA, como requisito avaliativo da disciplina de Fundamentos da Engenharia de Software.",
        ParagraphStyle(
            name="Presentation",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=12,
            leading=18,
            leftIndent=7 * cm,
            alignment=TA_JUSTIFY,
        ),
    ),
    Spacer(1, 1.2 * cm),
    p("Discente: Henrique de Lima Souza", "CenterText"),
    p("Docente: George Mendes Marra", "CenterText"),
    Spacer(1, 5 * cm),
    p("Goiânia", "CenterText"),
    p("2026", "CenterText"),
    PageBreak(),
]

# Sumario
summary_lines = [
    "1 INTRODUÇÃO",
    "2 METODOLOGIA",
    "3 TECNOLOGIAS UTILIZADAS",
    "4 ESTRUTURA DO SISTEMA",
    "4.1 Frontend (Interface do Usuário)",
    "4.2 Backend (APIs no Next.js)",
    "4.3 Banco de Dados (Prisma)",
    "5 REQUISITOS DO SISTEMA",
    "5.1 Requisitos Funcionais (RF)",
    "5.2 Requisitos Não Funcionais (RNF)",
    "6 FLUXO PRINCIPAL DO USUÁRIO",
    "7 CONSIDERAÇÕES FINAIS",
    "REFERÊNCIAS",
]
story.append(h("SUMÁRIO"))
for line in summary_lines:
    story.append(p(line, "ListText"))
story.append(PageBreak())

story += [
    h("1 INTRODUÇÃO"),
    p(
        "Este trabalho apresenta o desenvolvimento de uma aplicação web de controle de gastos pessoais. O sistema foi planejado para ajudar o usuário a organizar melhor sua vida financeira, permitindo o cadastro de receitas e despesas, a separação por categorias, a visualização de um dashboard e a geração de relatórios."
    ),
    p(
        "A proposta do projeto é oferecer uma solução prática e fácil de usar, reunindo em um único ambiente as principais funções para acompanhamento financeiro. Além disso, o sistema permite a exportação de dados em CSV e PDF, facilitando a análise das informações."
    ),
    h("2 METODOLOGIA"),
    p(
        "O presente trabalho foi desenvolvido por meio de pesquisa bibliográfica, tendo como base a documentação oficial das tecnologias utilizadas, bem como obras de referência na área de Engenharia de Software. A pesquisa bibliográfica permitiu embasar as decisões técnicas do projeto, orientando a escolha das ferramentas e a estruturação da aplicação."
    ),
    p(
        "A partir do referencial teórico levantado, foi realizado o desenvolvimento prático da aplicação web, seguindo boas práticas de desenvolvimento de software, como separação de responsabilidades, componentização da interface, segurança no acesso às rotas e persistência adequada dos dados. O processo de desenvolvimento foi conduzido de forma iterativa, com validação dos requisitos funcionais e não funcionais definidos para o sistema."
    ),
    h("3 TECNOLOGIAS UTILIZADAS"),
]

technologies = [
    "<b>Next.js:</b> framework utilizado no frontend e no backend da aplicação.",
    "<b>TypeScript:</b> utilizado para trazer mais segurança e organização ao código.",
    "<b>Prisma:</b> ORM responsável pelo acesso e pela modelagem do banco de dados.",
    "<b>SQLite:</b> banco de dados utilizado para persistência local das informações.",
    "<b>Autenticação por sessão:</b> utilizada para login, sessão e proteção de rotas privadas.",
    "<b>Node.js e npm:</b> utilizados no gerenciamento do projeto e dos scripts.",
]
for item in technologies:
    story.append(p(f"- {item}", "ListText"))

story += [
    h("4 ESTRUTURA DO SISTEMA"),
    h("4.1 Frontend (Interface do Usuário)"),
    p(
        "A parte visual do sistema foi organizada com páginas e componentes reutilizáveis. Entre os principais elementos estão a tela inicial, cadastro, login, dashboard, categorias, transações, relatórios e tela de usuário. Também foram utilizados componentes de interface como botões, cards, inputs, selects, tabelas e gráficos."
    ),
    h("4.2 Backend (APIs no Next.js)"),
    p(
        "O backend foi construído com rotas de API dentro do próprio Next.js. Essas rotas são responsáveis pela autenticação do usuário, gerenciamento de categorias, cadastro e controle de transações, geração de relatórios e exportações em CSV e PDF."
    ),
    h("4.3 Banco de Dados (Prisma)"),
    p(
        "O banco de dados é acessado por meio do Prisma. No schema são definidos os principais modelos da aplicação, como usuário, sessão, categoria e transação. Também foi previsto um arquivo de seed para popular o banco com dados iniciais, como categorias padrão e usuário de demonstração."
    ),
    h("5 REQUISITOS DO SISTEMA"),
    h("5.1 Requisitos Funcionais (RF)"),
]

functional_requirements = [
    "RF01: O sistema deve permitir que o usuário realize cadastro e login com segurança.",
    "RF02: O sistema deve permitir o registro de transações financeiras, incluindo despesas e receitas.",
    "RF03: O sistema deve permitir informar, nas transações, dados como tipo, valor, data, descrição e categoria.",
    "RF04: O sistema deve permitir criar, listar, editar e excluir categorias.",
    "RF05: O sistema deve permitir criar, listar e filtrar transações.",
    "RF06: O sistema deve apresentar um dashboard com visão geral das finanças do usuário.",
    "RF07: O sistema deve permitir gerar relatórios por período ou categoria.",
    "RF08: O sistema deve permitir gerar gráficos de barras e gráfico de pizza para melhor controle do usuário.",
    "RF09: O sistema deve permitir exportar os dados em formato CSV.",
    "RF10: O sistema deve permitir exportar relatórios em formato PDF.",
]
for item in functional_requirements:
    story.append(p(item, "ListText"))

story.append(h("5.2 Requisitos Não Funcionais (RNF)"))
non_functional_requirements = [
    "RNF01: O sistema deve possuir autenticação segura para acesso às áreas restritas.",
    "RNF02: O sistema deve proteger rotas privadas, como o dashboard, permitindo acesso apenas a usuários autenticados.",
    "RNF03: O sistema deve ser desenvolvido com TypeScript para aumentar a segurança e a organização do código.",
    "RNF04: O sistema deve utilizar Prisma para garantir melhor estrutura no acesso ao banco de dados.",
    "RNF05: O sistema deve possuir interface organizada com componentes reutilizáveis.",
    "RNF06: O sistema deve disponibilizar exportação compatível com ferramentas como Excel e planilhas.",
    "RNF07: O sistema deve manter os dados persistidos de forma adequada no banco de dados.",
    "RNF08: O sistema deve apresentar navegação simples e prática para o usuário.",
]
for item in non_functional_requirements:
    story.append(p(item, "ListText"))

story += [
    h("6 FLUXO PRINCIPAL DO USUÁRIO"),
]
flow = [
    "1. O usuário cria uma conta ou faz login no sistema.",
    "2. Após a autenticação, o usuário acessa o dashboard.",
    "3. O usuário pode visualizar categorias existentes e também criar, editar ou remover categorias.",
    "4. Na área de transações, o usuário registra informações como tipo, valor, data, categoria e descrição.",
    "5. Por fim, o usuário pode gerar relatórios e exportar os dados em CSV ou PDF.",
]
for item in flow:
    story.append(p(item, "ListText"))

story += [
    h("7 CONSIDERAÇÕES FINAIS"),
    p(
        "Este projeto foi importante para demonstrar como a tecnologia pode ajudar no controle financeiro pessoal. Com as funções de cadastro, login, registro de transações, categorias, dashboard e relatórios, o sistema atende ao seu objetivo. Dessa forma, o trabalho apresenta uma solução útil, prática e adequada para o dia a dia do usuário."
    ),
    h("REFERÊNCIAS"),
]

references = [
    "PRESSMAN, Roger S.; MAXIM, Bruce R. <i>Engenharia de Software: uma abordagem profissional</i>. 8. ed. Porto Alegre: AMGH, 2016.",
    "SOMMERVILLE, Ian. <i>Engenharia de Software</i>. 10. ed. São Paulo: Pearson, 2018.",
    "VERCEL. <i>Next.js Documentation</i>. Disponível em: &lt;https://nextjs.org/docs&gt;. Acesso em: jun. 2026.",
    "PRISMA. <i>Prisma Documentation</i>. Disponível em: &lt;https://www.prisma.io/docs&gt;. Acesso em: jun. 2026.",
    "MICROSOFT. <i>TypeScript Documentation</i>. Disponível em: &lt;https://www.typescriptlang.org/docs&gt;. Acesso em: jun. 2026.",
    "NODE.JS. <i>Node.js Documentation</i>. Disponível em: &lt;https://nodejs.org/docs&gt;. Acesso em: jun. 2026.",
]
for item in references:
    story.append(p(item, "ListText"))

doc = NumberedDoc(
    str(output_pdf),
    pagesize=A4,
    leftMargin=3 * cm,
    rightMargin=2 * cm,
    topMargin=3 * cm,
    bottomMargin=2 * cm,
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)

copy_path = OUTPUTS_DIR / "trabalho_abnt.pdf"
copy_path.write_bytes(output_pdf.read_bytes())

print(output_pdf)
print(copy_path)
