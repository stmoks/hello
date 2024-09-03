document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    let draggingElement = null;
  
    postsContainer.addEventListener('dragstart', (e) => {
      draggingElement = e.target;
      setTimeout(() => {
        e.target.classList.add('dragging');
        e.target.style.border = '2px dashed #007bff';
        e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
      }, 0);
    });
  
    postsContainer.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging');
      e.target.style.border = '';
      e.target.style.backgroundColor = '';
      draggingElement = null;
      
      // Add snap effect
      e.target.style.transition = 'transform 0.3s ease-out';
      e.target.style.transform = 'scale(1.05)';
      setTimeout(() => {
        e.target.style.transform = 'scale(1)';
        setTimeout(() => {
          e.target.style.transition = '';
        }, 300);
      }, 50);
    });
  
    postsContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(postsContainer, e.clientY);
      const currentElement = draggingElement;
      if (afterElement == null) {
        postsContainer.appendChild(currentElement);
      } else {
        postsContainer.insertBefore(currentElement, afterElement);
      }
    });
  
    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  });