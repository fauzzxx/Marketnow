import os
folder = r'c:\Projects\New folder\login\components\toolkit'

for file in os.listdir(folder):
    if file.endswith('.tsx'):
        filepath = os.path.join(folder, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            c = f.read()

        c = c.replace('["#EC4899\\", "#D946EF\\", "#9333EA\\", "#7C3AED\\"]', '["#EC4899", "#D946EF", "#9333EA", "#7C3AED"]')
        c = c.replace('theme=\\"light\\"', 'theme="light"')
        c = c.replace('variant=\\"dashboard\\"', 'variant="dashboard"')

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(c)
        print('Fixed', file)
