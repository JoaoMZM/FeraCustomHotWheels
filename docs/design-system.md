# 🎨 Design System — Fera Custom

Este documento define os padrões visuais e de interface do sistema da Fera Custom.

# 🎨 Paleta de Cores

## 📌 Cores principais

<div style="background-color:#D50000; padding:10px; color:white; border-radius:10px;">
  Primary Color - #D50000
</div>

<div style="margin:2px; background-color:#111111; padding:10px; color:white; border-radius:10px;">
  Secondary Color - #111111
</div>

<div style="margin:2px; background-color:#6E6E6E; padding:10px; color:white; border-radius:10px;">
  Neutral Color - #6E6E6E
</div>

<div style="margin:2px; background-color:#F5F5F5; padding:10px; color:black; border-radius:10px;">
  Background Color - #F5F5F5
</div>


# 🔤 Tipografia

## 📌 Fonte principal

- Font-family: Poppins, sans-serif

## 📌 Fonte secundária

- Font-family: Inter, sans-serif

## 📌 Hierarquia

- H1: 48px / Bold
- H2: 36px / SemiBold
- H3: 28px / Medium
- Body: 16px / Regular
- Small: 14px / Regular


# 🧩 Componentes

## 🔘 Button

### Primary Button

<div style="background:#D50000; color:white; padding:12px 24px; border-radius:12px; width:fit-content;">
  Comprar Agora
</div>

### Secondary Button

<div style="background:#111111; color:white; padding:12px 24px; border-radius:12px; width:fit-content;">
  Ver Catálogo
</div>

### Outline Button

<div style="border:2px solid #D50000; color:#D50000; padding:12px 24px; border-radius:12px; width:fit-content;">
  Saiba Mais
</div>


## 📌 Variações

- Primary
- Secondary
- Outline


## 📌 Estados

- Default
- Hover
- Active
- Disabled


## 📦 Card

### Uso

Container para agrupar informações e destacar produtos automotivos.

<div style="background:#FFFFFF; padding:24px; border-radius:24px; box-shadow:0 6px 20px rgba(0,0,0,0.12); max-width:300px;">
  <h3>Rodas Diecast</h3>
  <p>Produtos personalizados premium.</p>
</div>


# 📐 Espaçamento

## 📏 Escala de espaçamento

- 4px
- 8px
- 16px
- 24px
- 32px
- 48px


## 📌 Regra

Utilizar múltiplos de 8 para manter consistência visual.


# 📊 Grid

## 📌 Breakpoints

- Mobile: 320px
- Tablet: 768px
- Desktop: 1024px
- Large Desktop: 1440px


# 🌑 Sombras

## 📌 Shadow Small

```css
box-shadow: 0 2px 8px rgba(0,0,0,0.08);