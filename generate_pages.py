import os
import re

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Extract template parts
    main_start = html.find('<main>')
    main_end = html.find('</main>') + len('</main>')
    
    head_nav = html[:main_start]
    footer_scripts = html[main_end:]
    
    # Pages to generate
    pages = [
        'about', 'our-vision', 'legacy', 'management', 'our-resources', 'our-presence', 'sustainability', 'our-clientele',
        'projects', 'systems', 'ballastless-track-urban-metro', 'flash-butt-welding-of-rails', 'patil-rheda-system', 'precast-plinth',
        'products', 'sleepers', 'fasteners', 'wires', 'inserts', 'precast', 'safety',
        'cme', 'research-and-development', 'news', 'apnatech', 'careers', 'contact', 'whistleblower', 'privacy-policy'
    ]
    
    for page in pages:
        page_title = page.replace('-', ' ').title()
        
        # Simple content for new pages
        main_content = f"""  <main class="pt-[90px] min-h-screen bg-[#F5F4F1] flex items-center justify-center">
    <div class="text-center px-4">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#8A393B] mb-6">{page_title}</h1>
      <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">This page is currently under construction. Please check back later.</p>
      <a href="index.html" class="mt-8 inline-block bg-[#F2913F] text-white px-6 py-3 rounded-full hover:bg-[#D97706] transition-colors font-medium">Back to Home</a>
    </div>
  </main>"""
        
        full_html = head_nav + main_content + footer_scripts
        
        # Replace URLs
        full_html = full_html.replace('href="https://patilgroup.com/"', 'href="index.html"')
        full_html = full_html.replace('href="https://patilgroup.com"', 'href="index.html"')
        full_html = full_html.replace('href="/"', 'href="index.html"')
        
        for p in pages:
            full_html = full_html.replace(f'href="https://patilgroup.com/{p}"', f'href="{p}.html"')
            full_html = full_html.replace(f'href="/{p}"', f'href="{p}.html"')
            
        with open(f'{page}.html', 'w', encoding='utf-8') as f:
            f.write(full_html)
            
    # Also update index.html links
    print("Updating index.html links...")
    index_html = html
    index_html = index_html.replace('href="https://patilgroup.com/"', 'href="index.html"')
    index_html = index_html.replace('href="https://patilgroup.com"', 'href="index.html"')
    index_html = index_html.replace('href="#"', 'href="index.html"')
    for p in pages:
        index_html = index_html.replace(f'href="https://patilgroup.com/{p}"', f'href="{p}.html"')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(index_html)
        
    print("Done generating pages.")

if __name__ == '__main__':
    main()
