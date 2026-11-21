# PULJ × BLU — Resultados da prospecção ativa

Site estático (HTML + CSS + JS, sem build). Funil, totais, barras e textos são gerados a partir de **um único arquivo: `data.js`**.

## Rodar localmente

```bash
python3 -m http.server 8744
# abra http://localhost:8744
```

## Atualizar os números

1. Abra `data.js`.
2. Em `planilha`, cole as linhas do export do CRM (uma por usuário). `incluir: false` tira a pessoa do total.
3. Funil, resumo, barras de canais e taxas são calculados sozinhos a partir dessas linhas.
4. Textos da jornada, aprendizados e próximos passos também ficam em `data.js`.
5. O número de contratos (`contratos`) é manual.

## Publicar (GitHub → Vercel)

```bash
git init
git add .
git commit -m "Site de resultados PULJ × BLU"
git branch -M main
git remote add origin <URL-DO-REPOSITORIO>
git push -u origin main
```

Na Vercel: **Add New → Project → importar o repositório**. Framework preset: **Other**, sem build command e sem output directory. O `index.html` na raiz é servido direto.

## Estrutura

| Arquivo | Função |
|---|---|
| `index.html` | Estrutura das seções |
| `styles.css` | Design (cores, tipografia, layout) — variáveis no topo |
| `app.js` | Monta o conteúdo a partir de `data.js` e controla o movimento (GSAP) |
| `data.js` | **Todos os números e textos** |
| `assets/` | Logos (PULJ e BLU) e favicon |

## Notas

- Bibliotecas por CDN: GSAP + ScrollTrigger (cdnjs) e fontes Google (Instrument Serif/Sans, IBM Plex Mono).
- O site respeita `prefers-reduced-motion` (sem animações para quem desativa no sistema).
- `noindex` ativado no `<head>`: o material é interno do cliente e não deve aparecer em buscadores. Remova a meta `robots` se quiser indexar.
