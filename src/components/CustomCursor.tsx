// CursorComponent.jsx
import { useEffect } from 'react';
import { gsap } from 'gsap';
import './CustomCursor.css'; // Assuming you have separate CSS for the cursor

export default function CursorComponent() {

    useEffect(() => {
        const cursor = document.querySelector(".cursor");
    
        if(!cursor) return;
    
        const moveCursor = (e: MouseEvent) => {
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          gsap.to(cursor, { top: mouseY + "px", left: mouseX + "px", duration: 0 });
        };
    
        const hoverLink = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          const isLink = target.matches("a");
          if (isLink) {
            cursor.classList.add("expand");
          } else {
            cursor.classList.remove("expand");
          }
        }
    
        window.addEventListener("mouseover", hoverLink);
    
    
        window.addEventListener("click", () => {
          if (cursor) {
            cursor.classList.add("expand");
    
            setTimeout(() => {
              cursor.classList.remove("expand");
            }, 500);
          }
        }
        );
    
        window.addEventListener("mousemove", moveCursor);
    
        return () => {
          window.removeEventListener("mousemove", moveCursor);
          window.removeEventListener("mouseover", hoverLink);
        };
    
      }, []);

    return (
        <div className="cursor"></div>
    );
    }