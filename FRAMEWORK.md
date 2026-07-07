# Kybalion Protocol — FrameOracle

> **Fase atual: Documentação** · `2026-07-06`
>
> Este documento é o ponto de origem do **Kybalion Protocol** no FrameOracle —
> um sistema de 7 dimensões derivado das Leis do Hermetismo (Kybalion) adaptado
> para organizar, avaliar e evoluir features do produto.
>
> **Não é overengineering.** É uma lente de análise. Cada dimensão mapeia para algo
> concreto já existente (ou intencionalmente ausente) no codebase.

---

## Por que Hermetismo?

As 7 Leis Herméticas formam um sistema **completo e ortogonal** — cada lei cobre
um aspecto distinto da realidade sem sobreposição. Isso as torna úteis como
framework de avaliação: se uma feature atende todas as 7 dimensões, ela está
fundamentalmente sólida. Se não atende alguma, há uma lacuna consciente.

Uso principal: **filtro de priorização e coerência** — não de implementação.

> Quando uma feature não se encaixa em nenhuma das 7 → provável overengineering.
> Quando se encaixa em 3 ou mais → feature de alto impacto estratégico.

---

## As 7 Dimensões

### 1. 🧠 Clareza *(Lei do Mentalismo)*

> *"O Todo é Mente; o Universo é Mental."*

**Pergunta central:** O vídeo comunica uma única intenção clara?

Um vídeo viral tem **um** gancho central — não três. A clareza de propósito é o
pré-requisito de todo o resto. Se a intenção não é clara para o criador, não será
clara para o espectador.

**O que mede:**
- Coerência temática entre transcript, título e conclusão
- Presença de um hook único e identificável
- Ausência de "dois vídeos dentro de um"

**Maturidade no projeto:** 🟡 Parcial
- `conversationTopic.ts` — rastreia o tópico da conversa com o Director
- Análise de transcript no `frameoracle_engine/`
- Ainda não existe um "Clarity Score" unificado

**Gap:** Não há um módulo que analise o vídeo inteiro e devolva "qual é a intenção
central e quão clara ela está."

---

### 2. 🪞 Fidelidade *(Lei da Correspondência)*

> *"Como acima, assim abaixo; como abaixo, assim acima."*

**Pergunta central:** O que foi criado corresponde ao que foi intencionado?

A lei da correspondência é o princípio de que o output deve espelhar o input com
precisão. No contexto do editor, isso significa que o texto na tela deve
corresponder ao que o designer intencionou — em forma, timing e peso visual.

**O que mede:**
- Gap entre intenção do criador (roteiro, prompt) e output renderizado
- Fidelidade de animação: fonte, tamanho, peso, posição, timing
- Correspondência entre narração e texto exibido

**Maturidade no projeto:** 🟢 Mais madura — **medidor de fidelidade v58**
- `services/modelagem/` — pipeline completo de detect → sample → refine → render
- Medidor v58: fidelidade frame-a-frame de kinetic text
- `services/modelagem/measurement/` — CC + Gemini Vision para medição direta

**Gap:** Fidelidade hoje cobre texto na tela. Não cobre fidelidade narrativa
(intenção do roteiro vs. percepção do espectador).

---

### 3. ⚡ Energia *(Lei da Vibração)*

> *"Nada repousa; tudo vibra; tudo se move."*

**Pergunta central:** A vibração do vídeo está calibrada para o conteúdo?

Tudo tem frequência. Um vídeo de alto impacto com cortes lentos cria dissonância.
Um vídeo contemplativo com cortes rápidos gera ansiedade. A energia do áudio e o
ritmo de edição devem ser coerentes com a mensagem.

**O que mede:**
- Energia do áudio: BPM, loudness, dinâmica, frequência dominante
- Ritmo de cortes: cuts/minuto, duração média de cena
- Alinhamento entre energia do áudio e taxa de cortes
- Dissonância vibratória (energia alta + cortes lentos = sinal de alerta)

**Maturidade no projeto:** 🟠 Existe mas não integrado
- `services/audio_intelligence/` — análise de áudio (BPM, energia)
- `frameoracle_engine/` — detecção de cenas e segmentos
- Não existe pipeline que correlacione as duas fontes

**Gap:** `audio_intelligence` e detecção de cenas rodam separados. Não há
um "Energy Score" que cruze as duas fontes e avalie a coerência vibratória.

---

### 4. 🎯 Contraste *(Lei da Polaridade)*

> *"Tudo é dual; tudo tem polos; tudo tem seu par de opostos."*

**Pergunta central:** O vídeo tem tensão suficiente para manter atenção?

Sem contraste não há drama. Um vídeo plano (sempre no mesmo nível de energia,
sempre no mesmo tom) não gera engajamento. O hook é o polo alto; a resolução
é o polo oposto. A polaridade entre eles gera a tensão que mantém o espectador.

**O que mede:**
- Força do hook (quão alto é o "polo alto" do início)
- Variação de ritmo ao longo do vídeo
- Presença de momentos de baixa (respiro) para criar contraste
- Intensidade do CTA como polo final

**Maturidade no projeto:** 🟡 Base existe
- Medidor de fidelidade v58 detecta onde a atenção cai (polo negativo)
- `frustrationDetector.ts` / `negativeFeedbackDetector.ts` — detectam polo negativo
  na interação com o Director
- Não há mapeamento explícito de "polo alto vs. polo baixo" no conteúdo

**Gap:** O medidor de fidelidade detecta queda de retenção mas não classifica
os momentos como "polo alto" ou "polo baixo" narrativo.

---

### 5. 🌊 Fluxo *(Lei do Ritmo)*

> *"Tudo flui, vai e vem; tudo tem suas marés."*

**Pergunta central:** O vídeo respeita o arco narrativo natural de atenção?

A atenção humana não é linear — ela oscila em ciclos. Um bom vídeo respeita
isso: sobe, desce, sobe novamente. Vídeos que só sobem cansam. Vídeos que
só descem perdem o espectador.

**O que mede:**
- Arco narrativo: presença de início, desenvolvimento e resolução
- Ciclos de tensão/release (alinhados com padrões ~60-90s de atenção)
- Distribuição temporal dos momentos de impacto
- Ausência de "platô" (vídeo que para de acontecer no meio)

**Maturidade no projeto:** 🟡 Base existe
- `frameoracle_engine/` — segmentação de cenas com timestamps
- Medidor de fidelidade v58 — projeta retenção por segmento
- `planHistory.ts` — memória de planos multi-step no Director

**Gap:** Não há análise do arco narrativo como um todo. Temos peças isoladas
(segmentos, retenção por frame) mas não uma visão do "ritmo do vídeo inteiro".

---

### 6. 🔄 Rastreabilidade *(Lei da Causa e Efeito)*

> *"Toda causa tem seu efeito; todo efeito tem sua causa."*

**Pergunta central:** Cada decisão editorial tem impacto mensurável?

Este é o loop mais valioso e mais difícil: o editor faz uma escolha → essa escolha
causa um efeito na performance do vídeo → esse efeito retorna como dado para
informar a próxima escolha. Hoje esse loop está aberto — o lado da "causa"
existe, o lado do "efeito" não chega de volta.

**O que mede:**
- Atribuição: qual decisão editorial causou qual variação de retenção
- Loop fechado: edição → analytics → insight → próxima edição
- Rastreabilidade reversa: "por que este vídeo performou bem?"

**Maturidade no projeto:** 🔴 Loop aberto
- **Causa (existe):** `editHistory.ts` (22 tipos de eventos), `directorTelemetry.ts`,
  `intentHistory.ts` — tudo registrado com timestamp e clipId
- **Efeito (não existe):** retenção real, views, CTR não retornam ao editor
- É a dimensão mais difícil (depende de integração com analytics externo)
  e a mais valiosa para o produto

**Gap:** O `editHistory.ts` sabe exatamente o que foi feito. Não sabe o resultado.
Fechar esse loop transformaria o produto de editor em **motor de aprendizado**.

---

### 7. ⚖️ Equilíbrio *(Lei do Gênero)*

> *"O gênero está em tudo; tudo tem seu princípio masculino e feminino."*

**Pergunta central:** O vídeo tem estrutura técnica E ressonância emocional?

No contexto criativo: **masculino = estrutura/intenção** (roteiro, timeline, cortes
precisos, tracks corretas, legendas sem erro) e **feminino = receptividade/emoção**
(impacto no espectador, ressonância afetiva, memória emocional). Um vídeo
tecnicamente perfeito mas sem emoção não viraliza. O inverso também não sustenta.

**O que mede:**
- Estrutura (polo masculino): organização da timeline, ausência de issues técnicos,
  qualidade de captions, coerência de tracks
- Emoção (polo feminino): thumbnail, hook emocional, CTA, tom de voz,
  ressonância com o tema

**Maturidade no projeto:** 🟡 Um polo existe
- **Polo masculino (existe):** `inspectTimeline.ts` — 9 checkers de qualidade
  estrutural (orphan captions, duplicate assets, zero-duration clips, etc.)
- **Polo feminino (não existe):** não há análise de impacto emocional

**Gap:** A estrutura é auditável. A emoção, não. Adicionar análise de tom/emoção
ao pipeline de inteligência fecharia o equilíbrio desta dimensão.

---

## Mapa de Maturidade

| # | Dimensão | Lei | Maturidade | Gap principal |
|---|----------|-----|-----------|---------------|
| 1 | 🧠 Clareza | Mentalismo | 🟡 Parcial | Clarity Score unificado |
| 2 | 🪞 Fidelidade | Correspondência | 🟢 Alta | Fidelidade narrativa |
| 3 | ⚡ Energia | Vibração | 🟠 Existe, não integrado | Correlação áudio × cortes |
| 4 | 🎯 Contraste | Polaridade | 🟡 Base existe | Mapeamento polo alto/baixo |
| 5 | 🌊 Fluxo | Ritmo | 🟡 Base existe | Arco narrativo completo |
| 6 | 🔄 Rastreabilidade | Causa/Efeito | 🔴 Loop aberto | Analytics → editor feedback |
| 7 | ⚖️ Equilíbrio | Gênero | 🟡 Um polo | Análise de emoção |

---

## Features analisadas pelo framework

### ✅ Modelagem de Kinetic Text — todas as 7 dimensões presentes

O serviço `services/modelagem/` é o componente mais hermético do projeto:
a Modelagem **tem as 7 dimensões funcionando** — por isso é o mais complexo
de construir e o mais robusto em resultado.

Ver: [services/modelagem/README.md](../../services/modelagem/README.md)

### 🔴 Coach RAG — faltam 5 dimensões

`/coach/ask` responde perguntas mas não aprende com o impacto.
Faltam: Vibração, Polaridade, Ritmo, Causa/Efeito, Gênero (polo feminino).

O gap mais crítico: sem Causa/Efeito, o Coach não sabe se está sendo útil.

### 🟡 Oráculo — projetado para ter tudo, metade construído

`services/intelligence/` + ADR-021/025. F0/F1/F2 SHIPPED; F3 (onipotente) proposta.
A dimensão de Causa/Efeito (loop fechado conversa → ação → feedback) é a F3 pendente.

Ver: [frameoracle/docs/adr/ADR-021](../../frameoracle/docs/adr/ADR-021-Oraculo-third-agent-cross-surface.md)

### 🟢 Director — todas as 7 dimensões implementadas

O Director é o componente de referência: 60 arquivos, cada dimensão como módulo
separado com responsabilidade única e testes unitários.

Ver: [frameoracle/src/react-app/services/director/](../../frameoracle/src/react-app/services/director/)

---

## Uso como filtro de priorização

Ao avaliar uma nova feature ou decisão de arquitetura, passe pelo checklist:

```
[ ] Clareza:       A feature serve a uma intenção única e clara?
[ ] Fidelidade:    O output corresponde ao input esperado?
[ ] Energia:       A feature está calibrada para o nível de "vibração" correto?
[ ] Contraste:     A feature cria/preserva tensão narrativa suficiente?
[ ] Fluxo:         A feature respeita o ritmo natural de uso/atenção?
[ ] Rastreab.:     A feature fecha o loop causa → efeito → feedback?
[ ] Equilíbrio:    A feature equilibra estrutura técnica e impacto humano?
```

- **0–2 dimensões:** feature isolada ou cosmética
- **3–4 dimensões:** feature útil mas incompleta
- **5–7 dimensões:** feature estratégica — vale o investimento completo

---

## Próximos passos

- [ ] **Fase 1 — Documentação** *(atual)*: definir as 7 dimensões, mapear maturidade
- [ ] **Fase 2 — Protocolo**: definir interfaces TypeScript/Python para cada dimensão
- [ ] **Fase 3 — Implementação**: construir os módulos das dimensões com gap 🔴/🟠
- [ ] **Fase 4 — Integração**: `HermeticEvaluator` — avalia um vídeo/feature contra as 7

---

## Referências

- [docs/ARCHITECTURE.md](../ARCHITECTURE.md) — Constituição do Vimo
- [frameoracle/docs/adr/ADR-021](../../frameoracle/docs/adr/ADR-021-Oraculo-third-agent-cross-surface.md) — Oráculo cross-surface
- [frameoracle/docs/adr/ADR-025](../../frameoracle/docs/adr/ADR-025-Oraculo-executor-permission-modes.md) — Oráculo onipotente
- [services/modelagem/README.md](../../services/modelagem/README.md) — Pipeline de Modelagem
- [frameoracle/src/react-app/services/director/inspectTimeline.ts](../../frameoracle/src/react-app/services/director/inspectTimeline.ts) — Inspector da Timeline
