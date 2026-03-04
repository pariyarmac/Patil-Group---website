import os

def main():
    # 1. Read our unified template frame (index.html)
    with open('index.html', 'r', encoding='utf-8') as f:
        template = f.read()
        
    main_start = template.find('<main>') + len('<main>')
    main_end = template.find('</main>')
    
    header = template[:main_start]
    footer = template[main_end:]
    
    # 2. Read the downloaded about.html
    with open('downloaded_about.html', 'r', encoding='utf-8') as f:
        downloaded = f.read()

    # Get the contents of <main> from about.html
    main_dl_start = downloaded.find('<main>')
    
    if main_dl_start != -1:
        main_dl_start += len('<main>')
        main_dl_end = downloaded.find('</main>')
        about_content = downloaded[main_dl_start:main_dl_end]
    else:
        # Fallback if no <main> tag
        start = downloaded.find('<body')
        start = downloaded.find('>', start) + 1
        end = downloaded.find('<footer')
        if end == -1: end = downloaded.find('</body>')
        about_content = downloaded[start:end]

    # Clean up the external links to be local again
    pages = [
        'about', 'our-vision', 'legacy', 'management', 'our-resources', 'our-presence', 'sustainability', 'our-clientele',
        'projects', 'systems', 'ballastless-track-urban-metro', 'flash-butt-welding-of-rails', 'patil-rheda-system', 'precast-plinth',
        'products', 'sleepers', 'fasteners', 'wires', 'inserts', 'precast', 'safety',
        'cme', 'research-and-development', 'news', 'apnatech', 'careers', 'contact', 'whistleblower', 'privacy-policy'
    ]
    
    # Simple naive replace for links inside the new content
    for p in pages:
        about_content = about_content.replace(f'href="/{p}"', f'href="{p}.html"')
        about_content = about_content.replace(f'href="https://patilgroup.com/{p}"', f'href="{p}.html"')
    
    about_content = about_content.replace('href="/"', 'href="index.html"')
    about_content = about_content.replace('href="https://patilgroup.com/"', 'href="index.html"')
    
    # Fix the images! Next.js uses absolute paths without the domain (/image.png)
    # So we need to prepend the external domain so it actually loads
    about_content = about_content.replace('src="/', 'src="https://patilgroup.com/')
    
    # The background map image
    about_content = about_content.replace("url('/worldmap.png')", "url('https://patilgroup.com/worldmap.png')")
    
    # Optional: Fix any <source src="/somevideo.mp4"> just in case
    # This overlaps with src="/" above but better safe than sorry
    
    # Padding under the navbar so content isn't hidden
    # In index.html, hero video handles it. In subpages, we need padding.
    about_content = f'<div class="pt-[90px] bg-white">\n{about_content}\n</div>'

    # Write the combined result
    with open('about.html', 'w', encoding='utf-8') as f:
        f.write(header + about_content + footer)
        
    print("Injected about page content and fixed image/asset links.")

if __name__ == '__main__':
    main()
