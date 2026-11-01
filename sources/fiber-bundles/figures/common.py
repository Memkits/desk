import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt, numpy as np
from matplotlib import font_manager
plt.rcParams.update({'font.family': ['Noto Sans CJK SC', 'DejaVu Sans'], 'axes.unicode_minus': False,
  'figure.facecolor': '#070A12', 'axes.facecolor': '#070A12', 'savefig.facecolor': '#070A12',
  'text.color': '#E9EEF7', 'axes.labelcolor': '#A3AEC3', 'xtick.color': '#66728C', 'ytick.color': '#66728C', 'axes.edgecolor': '#2C3854', 'font.size': 15})
GOLD, BLUE, RED, GREEN, PURP, FG2, FG3 = '#FFD27A', '#5CB4FF', '#FF7A93', '#5FE0A0', '#C79BFF', '#A3AEC3', '#66728C'
def fig(w=16, h=9): return plt.figure(figsize=(w, h), dpi=120)
def title(f, t, sub=None):
    f.text(.04, .93, t, fontsize=30, fontweight='bold', color='#E9EEF7', family='Noto Serif CJK SC')
    if sub: f.text(.04, .885, sub, fontsize=16, color=FG2)
def save(f, name): f.savefig(f'img/{name}.png'); plt.close(f); print(name)
def clean(ax): ax.set_xticks([]); ax.set_yticks([]); [s.set_visible(False) for s in ax.spines.values()]
