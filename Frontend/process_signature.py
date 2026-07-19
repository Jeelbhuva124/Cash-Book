from PIL import Image, ImageOps
import sys
import os

def process(input_path, output_path):
    print(f"Processing {input_path} -> {output_path}")
    if not os.path.exists(input_path):
        print("File not found")
        sys.exit(1)
        
    img = Image.open(input_path).convert("L")
    img_inv = ImageOps.invert(img)
    
    # Aggressive noise removal to guarantee a tight crop. 
    # Any light noise (like a scanned background) becomes strictly 0 alpha.
    img_inv = img_inv.point(lambda p: 0 if p < 100 else min(255, int((p-100)*1.8)))
    
    solid_color = Image.new("RGBA", img.size, (29, 78, 216, 255))
    solid_color.putalpha(img_inv)
    
    # Crop tightly to the exact edges of the signature
    bbox = solid_color.getbbox()
    if bbox:
        solid_color = solid_color.crop(bbox)
        
    solid_color.save(output_path, "PNG")
    print("Done")

process(sys.argv[1], sys.argv[2])
