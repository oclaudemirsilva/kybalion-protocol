# DIMENSIONS — Kybalion Protocol

> Especificação técnica das 7 dimensões. Cada dimensão define:
> - O que mede (contrato)
> - Intervalo de score (0–100)
> - Thresholds de qualidade
> - Como calcular (algoritmo de referência)
> - Sinais de gap (o que significa score baixo)

---

## Contratos gerais

Todo evaluator de dimensão recebe um `EvalContext` e devolve um `DimensionScore`:

```typescript
interface DimensionScore {
  score: number;        // 0–100 (inteiro ou float com 1 casa decimal)
  confidence: number;   // 0.0–1.0 (quão confiável é o score)
  gap: string | null;   // null se score >= threshold; string descritiva se abaixo
  insight: string;      // 1 frase acionável (positiva ou corretiva)
  source: string[];     // módulos/APIs que geraram o score
}
```

**Regra de confidence:**
- `1.0` → dados completos, avaliação direta
- `0.7–0.9` → dados parciais, estimativa com base em proxy
- `< 0.7` → dados insuficientes (score é uma estimativa conservadora)
- `0.0` → dimensão não pôde ser avaliada (score = 50 por convenção, não zero)

**Regra do score `50` por convenção:**
Quando não há dados para avaliar uma dimensão, o score é `50` (neutro),
não `0` — para não penalizar projetos que simplesmente não têm o dado disponível.
O `confidence` é `0.0` para sinalizar a incerteza.

---

## 1. 🧠 Clareza *(Mentalism)*

### O que mede
A singularidade e clareza da intenção central do produto/conteúdo.
Um produto com propósito único e comunicado claramente tem Clareza alta.

### Algoritmo de referência

```
clarity_score = weighted_average([
  single_intention_score × 0.50,   // há UMA mensagem central? (LLM)
  hook_clarity_score    × 0.30,   // o início comunica o propósito? (LLM)
  conclusion_alignment  × 0.20,   // o fim retorna ao propósito? (LLM)
])
```

**Para conteúdo de vídeo:**
1. Extrair transcript
2. LLM prompt: *"Qual é a intenção central deste conteúdo? Há uma única mensagem? Responda com score 0-100 e justificativa."*
3. Detectar divergência início ↔ fim (se houver)

**Para features de software:**
1. Ler descrição/docstring/README da feature
2. LLM prompt: *"Esta feature resolve um único problema? Tem escopo bem definido?"*

### Thresholds

| Score | Significado |
|-------|-------------|
| 80–100 | Intenção única e clara — sem ambiguidade |
| 60–79 | Intenção identificável mas com ruído secundário |
| 40–59 | Múltiplas intenções disputando atenção |
| < 40 | Sem intenção central identificável |

### Sinal de gap
`score < 60` → gap: *"Mais de uma intenção detectada. Defina a mensagem central antes de continuar."*

---

## 2. 🪞 Fidelidade *(Correspondence)*

### O que mede
O grau em que o output corresponde ao que foi intencionado (input → output fidelity).
Alta fidelidade = o que foi prometido/planejado é o que foi entregue.

### Algoritmo de referência

```
fidelity_score = weighted_average([
  output_matches_spec    × 0.60,  // output medido vs. spec declarada
  no_unintended_drift   × 0.25,  // ausência de desvio não-intencional
  reversibility_ratio   × 0.15,  // ações reversíveis preservam intenção
])
```

**Para kinetic text (vídeo):**
- Medidor frame-a-frame: `fidelity_score = mean(per_clip_fidelity_scores)`

**Para features de software:**
1. Comparar spec declarada (docstring, ADR) com comportamento observado (testes)
2. Taxa de testes verdes = proxy de fidelidade

**Para conteúdo:**
1. Comparar roteiro/prompt com transcript final
2. `fidelity = 1 - levenshtein_normalized(roteiro, transcript)`

### Thresholds

| Score | Significado |
|-------|-------------|
| 85–100 | Correspondência quase perfeita |
| 70–84 | Pequenos desvios aceitáveis |
| 50–69 | Desvios notáveis — intenção parcialmente perdida |
| < 50 | Output diverge significativamente do input |

### Sinal de gap
`score < 70` → gap: *"O output diverge da intenção. Verifique o pipeline entre input e output."*

---

## 3. ⚡ Energia *(Vibration)*

### O que mede
O alinhamento entre a energia do conteúdo e sua forma de apresentação.
Alta energia: conteúdo dinâmico + apresentação dinâmica. Baixa energia:
conteúdo contemplativo + apresentação calma. **Dissonância é penalizada.**

### Algoritmo de referência

```
energy_score = f(
  content_energy,        // energia intrínseca do conteúdo (0–100)
  presentation_energy,   // energia da apresentação (0–100)
  alignment_bonus        // bônus por coerência (ou penalidade por dissonância)
)

alignment = 1 - |content_energy - presentation_energy| / 100
energy_score = mean(content_energy, presentation_energy) × (0.5 + alignment × 0.5)
```

**Para vídeo:**
- `content_energy` = análise de áudio (BPM normalizado, RMS loudness, variância)
- `presentation_energy` = cuts/min normalizado (0 cuts/min = 0, 60 cuts/min = 100)
- `alignment` = correlação de Pearson entre as curvas temporais

**Para software:**
- `content_energy` = complexidade ciclomática da feature (proxy de densidade)
- `presentation_energy` = complexidade da UI/API surface

### Thresholds

| Score | Significado |
|-------|-------------|
| 75–100 | Energia calibrada — conteúdo e forma alinhados |
| 55–74 | Pequena dissonância — aceitável |
| 35–54 | Dissonância clara — energia do conteúdo != energia da forma |
| < 35 | Dissonância severa |

### Sinal de gap
`score < 55` → gap: *"Energia do conteúdo e da apresentação estão descalibradas. Ajuste o ritmo de edição ou o estilo."*

---

## 4. 🎯 Contraste *(Polarity)*

### O que mede
A amplitude de variação entre os polos alto e baixo do conteúdo/feature.
Sem contraste = sem tensão = sem atenção.

### Algoritmo de referência

```
contrast_score = weighted_average([
  hook_strength     × 0.40,  // força do polo alto inicial (0–100)
  variation_range   × 0.35,  // amplitude max-min da curva de atenção
  resolution_clear  × 0.25,  // polo final é identificável? (CTA, conclusão)
])

variation_range = (max_attention - min_attention) / 100
```

**Para vídeo:**
- `hook_strength` = score dos primeiros 10% do vídeo na curva de retenção
- `variation_range` = (max_retention - min_retention) / 100 ao longo do vídeo
- `resolution_clear` = LLM: *"Os últimos 15% têm uma conclusão/CTA claro?"*

**Para features:**
- `hook_strength` = clareza do problema que a feature resolve
- `variation_range` = diferença entre estado antes e depois de usar a feature
- `resolution_clear` = há um estado final claro (sucesso/erro definido)?

### Thresholds

| Score | Significado |
|-------|-------------|
| 70–100 | Contraste forte — tensão narrativa clara |
| 50–69 | Contraste moderado — alguma variação |
| 30–49 | Conteúdo plano — pouca variação de polo |
| < 30 | Sem contraste identificável |

### Sinal de gap
`score < 50` → gap: *"Conteúdo plano — sem pico inicial ou sem resolução final. Adicione tensão."*

---

## 5. 🌊 Fluxo *(Rhythm)*

### O que mede
O respeito ao arco narrativo natural de atenção humana. Alto fluxo = o
conteúdo sobe, varia, desce e resolve em proporções que coincidem com padrões
naturais de atenção.

### Algoritmo de referência

```
flow_score = weighted_average([
  arc_presence     × 0.40,  // há um arco narrativo identificável? (3 atos)
  plateau_penalty  × 0.35,  // penaliza janelas sem variação (platôs)
  resolution_timing× 0.25,  // resolução ocorre no terço final?
])

arc_presence = bool(act1_rising and act3_resolving) → 100 : 0
plateau_penalty = 100 - (plateau_seconds / total_seconds) × 100
```

**Para vídeo:**
- Dividir em 3 atos (0–33%, 33–66%, 66–100%)
- `arc_presence`: ato 1 > média geral? ato 3 tem variação?
- `plateau_penalty`: janelas de 30s+ com variação < 5% na curva de retenção
- `resolution_timing`: LLM no transcript do terço final

**Para software:**
- `arc_presence` = fluxo do usuário tem início, meio e fim claros?
- `plateau_penalty` = há etapas sem feedback/progresso visível?

### Thresholds

| Score | Significado |
|-------|-------------|
| 70–100 | Fluxo natural — arco narrativo respeitado |
| 50–69 | Fluxo parcial — arco existe mas tem interrupções |
| 30–49 | Fluxo fragmentado — sem arco claro |
| < 30 | Sem estrutura narrativa |

### Sinal de gap
`score < 50` → gap: *"Sem arco narrativo identificável. Estruture em 3 atos: abertura, desenvolvimento, resolução."*

---

## 6. 🔄 Rastreabilidade *(Cause & Effect)*

### O que mede
O grau em que cada decisão produz um efeito mensurável e rastreável.
Alta rastreabilidade = loop fechado: decisão → efeito → feedback → próxima decisão.

### Algoritmo de referência

```
traceability_score = weighted_average([
  loop_closure     × 0.60,  // o loop causa→efeito está fechado? (0 ou 100)
  decision_coverage× 0.25,  // % de decisões com efeito registrado
  feedback_latency × 0.15,  // quão rápido o efeito chega de volta?
])
```

**Para software/produto:**
- `loop_closure` = existe pipeline que liga ação do usuário a métrica de resultado?
  - Sim → 100; Não → 0 (binário)
- `decision_coverage` = % de features com analytics de resultado
- `feedback_latency` = tempo médio entre decisão e dado de resultado (minutos → 100, semanas → 30)

**Nota especial:** Esta dimensão é intencionalmente honesta.
Projetos sem analytics recebem score baixo — isso é correto, não injusto.
O score baixo é o sinal para fechar o loop.

### Thresholds

| Score | Significado |
|-------|-------------|
| 70–100 | Loop fechado — decisões têm feedback mensurável |
| 40–69 | Loop parcialmente fechado — alguns dados disponíveis |
| 10–39 | Loop aberto — decisões sem retorno mensurável |
| < 10 | Sem rastreabilidade — decisões completamente cegas |

### Sinal de gap
`score < 40` → gap: *"Loop de causa-efeito aberto. Implemente analytics que retornem dados ao tomador de decisão."*

---

## 7. ⚖️ Equilíbrio *(Gender)*

### O que mede
O equilíbrio entre o polo estrutural (masculino: forma, função, técnica) e
o polo emocional (feminino: impacto, ressonância, experiência). Ambos são
necessários; nenhum sozinho é suficiente.

### Algoritmo de referência

```
balance_score = weighted_average([
  structural_score  × 0.40,  // polo masculino: qualidade técnica/estrutural
  emotional_score   × 0.60,  // polo feminino: impacto emocional/experiencial
])
```

**Nota:** Emoção pesa mais (0.60) porque é mais difícil de acertar e é o
diferenciador de longo prazo entre produtos que ficam e que são esquecidos.

**Para conteúdo de vídeo:**
- `structural_score` = ausência de issues técnicos (linter/inspetor de timeline ou equivalente)
- `emotional_score` = LLM: *"Este conteúdo evoca uma emoção primária clara? Qual? Score 0-100."*

**Para software:**
- `structural_score` = cobertura de testes, ausência de bugs críticos, performance
- `emotional_score` = NPS, user satisfaction, qualidade do onboarding

### Thresholds

| Score | Significado |
|-------|-------------|
| 75–100 | Equilíbrio sólido — estrutura e emoção presentes |
| 55–74 | Um polo dominante, outro presente |
| 35–54 | Desequilíbrio claro — um polo ausente |
| < 35 | Apenas um polo — produto incompleto |

### Sinal de gap
`score < 55` → gap: *"Desequilíbrio detectado. Verifique qual polo está fraco: estrutura técnica ou impacto emocional."*

---

## Scoring consolidado

### Fórmula do overall_score

```
overall_score = mean(
  clarity,
  fidelity,
  energy,
  contrast,
  flow,
  traceability,
  balance
)
```

Ponderação igual por design — cada dimensão tem o mesmo peso.
Projetos podem criar fórmulas customizadas para seu domínio, desde que
documentem o desvio.

### Maturidade

| Dimensões com score >= 70 | Maturity level |
|--------------------------|----------------|
| 0–1 | `seed` |
| 2–3 | `sprouting` |
| 4–5 | `growing` |
| 6 | `mature` |
| 7 | `complete` |

---

## Referências

- [README.md](./README.md) — visão geral do protocolo
- [SPEC.md](./SPEC.md) — interfaces TypeScript/Python formais
- [PROTOCOL.md](./PROTOCOL.md) — formato do KybalionReport
