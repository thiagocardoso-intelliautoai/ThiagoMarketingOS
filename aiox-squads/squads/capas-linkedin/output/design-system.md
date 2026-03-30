# Design System — Print de Autoridade

## Slug
`ia-sistema-nervoso-numeros-reais`

## Palette (5 cores)
| Token       | Hex       | Uso                                      |
|-------------|-----------|------------------------------------------|
| Background  | #000000   | Fundo principal (preto puro)             |
| Surface     | #111111   | Container do print                       |
| Text        | #FFFFFF   | Texto do Thiago, hero text               |
| Accent      | #FFD700   | Palavra-destaque, footer line, dados key |
| Muted       | #888888   | Handle, fonte, textos secundários        |
| Border      | #2A2A2A   | Borda do container do print              |

## Typography
| Elemento         | Font   | Size  | Weight | Color   |
|------------------|--------|-------|--------|---------|
| Nome perfil      | Inter  | 28px  | 700    | #FFFFFF |
| Handle           | Inter  | 22px  | 400    | #8B8B8B |
| Hero text        | Inter  | 42px  | 700    | #FFFFFF |
| Highlight word   | Inter  | 42px  | 800    | #FFD700 |
| Print header     | Inter  | 20px  | 600    | #FFFFFF |
| Print data big   | Inter  | 48px  | 800    | #FFD700 |
| Print data label | Inter  | 18px  | 500    | #CCCCCC |
| Print source     | Inter  | 16px  | 400    | #666666 |
| Footer line      | —      | 3px h | —      | gradient(#FFD700→#F59E0B) |

## Layout
- Viewport: 1080 x 1350
- Padding: 60px
- Flex column, space-between
- Print ocupa ~45% da altura vertical

## Design Rationale
- **Print como dashboard de dados:** Como o post cita múltiplos KPIs da G4, o "print" será um painel estilizado de dados reais, não um screenshot de tweet. Isso reforça credibilidade e cria um visual de "dashboard de resultados" que gera saves.
- **Opinião do Thiago acima:** Frase curta e provocadora que contextualiza os dados ("Isso não é usar IA. É outra coisa.") — o Thiago é o guia, o print é a prova.
- **Dourado nos números:** Cor de acento nos dados-chave cria hierarquia visual imediata e reforça a ideia de "valor/resultado".
- **Container escuro estilizado:** Borda sutil + shadow no container de dados simula um print de tela sem precisar de screenshot real.
