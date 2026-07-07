# Validation Cases — Kybalion Protocol

> **Suíte de Testes Conceituais e Evidências de Validação** · `2026-07-06`
> 
> Este documento funciona como a suíte de testes conceituais do Kybalion Protocol. 
> Ele demonstra como o framework se comporta diante de diferentes inputs e 
> prova que ele gera diagnósticos consistentes e acionáveis em múltiplos domínios.

---

## Caso de Teste 1: Pedagogia Matemática (Abstração vs. Intuição)

* **Subject:** Aula/Demonstração de "Espaço Vetorial" para calouros de engenharia.
* **Objetivo:** Avaliar a eficácia de duas abordagens de ensino distintas usando as dimensões do protocolo.

```
                  [ A: Puramente Axiomática ]      [ B: Intuição -> Rigor ]
Clarity                  ██████████                       █████████░
Fidelity                 ██████████                       ████████░░
Energy                   ███░░░░░░░ (Dissonante)          ████████░░ (Calibrada)
Contrast                 ██░░░░░░░░ (Sem exemplos)        ███████░░░ (Exemplos)
Flow                     ████░░░░░░ (Direto ao formal)    █████████░ (3 atos)
Traceability             ████░░░░░░                       ███████░░░
Balance                  ███░░░░░░░ (100% Masculino)      ████████░░ (Equilibrado)
```

### Relatório de Diagnóstico Comparativo

#### Abordagem A: Puramente Axiomática
* **Descrição:** O professor começa a aula listando os 8 axiomas abstratos na lousa e provando teoremas.
* **Gargalos Identificados:**
  * **Energia (30/100):** Dissonância cognitiva. Nível de abstração elevado demais para a maturidade dos alunos (calouros).
  * **Contraste (20/100):** Não mostra contra-exemplos (o que *não* é um espaço vetorial, como o círculo unitário). O aluno não entende a fronteira da regra.
  * **Equilíbrio (25/100):** 100% estrutura técnica (polo masculino), 0% conexão emocional ou intuição visual (polo feminino).
* **Veredicto Kybalion:** Sistema imaturo (`sprouting`). O conhecimento é transmitido de forma estéril e inacessível.

#### Abordagem B: Intuição $\to$ Rigor
* **Descrição:** O professor começa com flechas no plano (soma e escala geométricas), extrai as propriedades naturais dessas operações, mostra onde essa intuição falha (espaços de funções) e então formaliza os axiomas.
* **Melhorias Diagnosticadas:**
  * **Energia (80/100):** Começa com energia baixa (concreta) e eleva ritmicamente à medida que os alunos ganham confiança.
  * **Equilíbrio (80/100):** União estável de intuição geométrica e rigor matemático.
* **Veredicto Kybalion:** Sistema maduro (`growing`/`mature`). O conhecimento é absorvido com menor esforço cognitivo.

---

## Caso de Teste 2: Demarcação Científica (Popperian Falsification)

* **Subject:** Comparação de integridade científica de duas teorias explicativas.
* **Objetivo:** Validar se o protocolo consegue aplicar a regra de demarcação de Karl Popper (falsificacionismo) de forma automatizada.

### Relatório de Diagnóstico Comparativo

#### Contexto A: Astrologia (Pseudociência)
* **Descrição:** Teoria que afirma que a posição dos astros determina o destino dos indivíduos.
* **Gargalo Crítico:** **Contraste (0/100)** e **Rastreabilidade (10/100)**.
* **Análise do Protocolo:** A hipótese falha na demarcação porque não descreve nenhuma condição de falha. Se o sujeito ganha dinheiro, a astrologia confirma; se perde, atribui-se ao livre-arbítrio ou a outra casa planetária. Não existe "cisne negro" previsto.
* **Veredicto Kybalion:** Sistema rejeitado como pseudociência devido a **Contraste = 0**.

#### Contexto B: Ensaio Clínico de Medicamento (Ciência Falseável)
* **Descrição:** Teste duplo-cego de eficácia de uma nova molécula contra placebo.
* **Análise do Protocolo:**
  * **Contraste (95/100):** O teste define claramente a hipótese nula ($H_0$: o remédio não funciona) e a região de rejeição estatística ($p < 0.05$). Há uma condição matemática clara onde o experimento falhará e a teoria será refutada.
  * **Rastreabilidade (90/100):** Dados e código do ensaio são públicos para que outros cientistas tentem replicar (e falhar em replicar) o efeito.
* **Veredicto Kybalion:** Sistema cientificamente íntegro.

---

## Caso de Teste 3: Gestão de Processos (Agile)

* **Subject:** Auditoria de dois times de engenharia rodando Sprints de desenvolvimento.
* **Objetivo:** Detectar a diferença entre o *Real Agile* e o *Fake Agile*.

### Relatório de Diagnóstico Comparativo

#### Contexto A: Sprint "Pastelaria" (Fake Agile)
* **Descrição:** O time roda Sprints de 2 semanas, mas puxa 50 tarefas aleatórias do backlog sem relação entre si. As reuniões diárias viram status report e a retrospectiva nunca gera ações reais.
* **Gargalos Identificados:**
  * **Clareza (30/100):** Sem Sprint Goal. O time gasta energia de trabalho, mas não sabe qual é a intenção unificada da iteração.
  * **Traceability (10/100):** A retrospectiva é teatral. Problemas são citados, mas nenhuma alteração de processo (causa) é implementada e medida no Sprint seguinte (efeito). O loop é permanentemente aberto.
* **Veredicto Kybalion:** Processo ineficiente e burocrático.

#### Contexto B: Sprint Intencional (Real Agile)
* **Descrição:** O time define um Sprint Goal claro (*"Reduzir o tempo de renderização em 20%"*). Limita o WIP (tarefas simultâneas) para calibrar a energia do time e usa retrospectivas para rodar melhorias de processo testáveis.
* **Análise do Protocolo:**
  * **Clareza (90/100):** Alinhamento perfeito ao redor do Sprint Goal.
  * **Energia (85/100):** Limite de WIP impede gargalos e burnouts, mantendo a vibração do time estável.
  * **Rastreabilidade (80/100):** Cada retro resulta em um item de ação mensurável testado no ciclo seguinte.
* **Veredicto Kybalion:** Processo maduro e autossustentável.

---

## Caso de Teste 4: Recursão Hermética (O Metaprotocolo)

* **Subject:** O código-fonte do repositório da biblioteca `kybalion-protocol`.
* **Objetivo:** Provar que o protocolo consegue auto-avaliar seu próprio processo de desenvolvimento e base de código de forma recursiva.

### Relatório de Diagnóstico de Auto-Avaliação

#### Simulação A: Código poluído no Core (PR rejeitado)
* **Descrição:** Um desenvolvedor envia um PR adicionando 5 novos métodos utilitários complexos ao core e pulando os testes unitários correspondentes.
* **Gargalos Diagnosticados pelo Metaprotocolo:**
  * **Clareza (40/100):** API pública inchada. A semente de simplicidade do core foi violada com utilitários redundantes.
  * **Fidelidade (30/100):** Os testes unitários não cobrem a especificação dos novos métodos descritos no PR.
  * **Equilíbrio (40/100):** Excesso de complexidade técnica no core sem documentação explicativa.
* **Veredicto Kybalion:** Auto-rejeitado com **Maturidade = `growing`** e **Symmetry = 0.45**. O PR é bloqueado automaticamente pelo robô do CI/CD com base no relatório hermético.

#### Simulação B: PR Limpo com Adapters Segregados (PR Aprovado)
* **Descrição:** PR com refatoração do evaluator isolado por interface, 100% de cobertura de testes no Vitest e documentação inline atualizada.
* **Análise do Metaprotocolo:**
  * **Fidelidade (95/100):** Vitest confirma cobertura de 100% dos contratos do SPEC.md.
  * **Rastreabilidade (90/100):** Tratamento robusto de erros no executor de adapters, permitindo rastrear falhas isoladas de terceiros.
  * **Equilíbrio (90/100):** API enxuta e legível com documentação rica de exemplos práticos no README.
* **Veredicto Kybalion:** PR aprovado com **Maturidade = `complete`** e **Symmetry = 0.92**.
