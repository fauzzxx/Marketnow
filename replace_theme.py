import os, re
folder = r'c:\Projects\New folder\login\components\toolkit'

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()

    # Colors
    c = c.replace('["#FF6422\", "#4F7CFF\", "#7C4DFF\", "#00BC8E\"]', '["#EC4899\", "#D946EF\", "#9333EA\", "#7C3AED\"]')
    
    # Tooltips
    c = c.replace('backgroundColor: "#1B1040"', 'backgroundColor: "#fff"')
    c = c.replace('border: "1px solid rgba(255,255,255,0.1)"', 'border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"')
    c = c.replace('color: "#fff"', 'color: "#1e293b"')
    c = c.replace("color: '#fff'", "color: '#1e293b'")
    
    # Tick/Cursor
    c = c.replace('rgba(255,255,255,0.4)', '#94a3b8')
    c = c.replace('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.03)')
    
    # Text
    c = re.sub(r'text-white/([3-6]0)', r'text-slate-500', c)
    c = re.sub(r'text-white/[7-9]0', r'text-slate-600', c)
    c = c.replace(' text-white', ' text-slate-800')
    c = c.replace('"text-white', '"text-slate-800')

    # Backgrounds and borders
    c = c.replace('bg-white/5', 'bg-white')
    c = c.replace('bg-white/10', 'bg-slate-50')
    c = c.replace('border-white/10', 'border-slate-200')
    c = c.replace('border-white/5', 'border-slate-100')
    c = c.replace('glass-card', 'bg-white rounded-[1.5rem] shadow-sm border border-slate-200')
    
    # Specific shadows/colors
    c = c.replace('shadow-primary/20', 'shadow-purple-500/20')
    c = c.replace('text-[#FF6422]', 'text-[#EC4899]')
    c = c.replace('text-emerald-500', 'text-emerald-600')
    c = c.replace('bg-emerald-500/20', 'bg-emerald-50')
    c = c.replace('border-emerald-500/30', 'border-emerald-100')
    c = c.replace('text-red-500', 'text-red-500')
    c = c.replace('bg-red-500/20', 'bg-red-50')
    c = c.replace('border-red-500/30', 'border-red-100')

    # Inputs & Buttons using dynamic replacement
    c = re.sub(r'<Input(?!\s+theme)', r'<Input theme="light"', c)
    c = re.sub(r'<Button(?!\s+variant)', r'<Button variant="dashboard"', c)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated', os.path.basename(filepath))

for file in os.listdir(folder):
    if file.endswith('.tsx'):
        replace_in_file(os.path.join(folder, file))
