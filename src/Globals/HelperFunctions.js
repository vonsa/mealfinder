export class HelperFunctions {
  /*
    Replace element with a clone
    Usefull for removing eventlisteners
  */
  static refreshElements(...targets) {
    targets.forEach((target) => {
      const cloned = target.cloneNode(true);
      target.parentNode.replaceChild(cloned, target);
    });
  }

  static toggleSpinner() {
    document.querySelector('.spinner').classList.toggle('active');
  }

  static toggleOverlay() {
    const overlay = document.querySelector('.overlay');
    overlay.classList.toggle('visible');
    return overlay;
  }

  static shortenInputString(input) {
    if (input.length > 17) {
      return input.substring(0, 14) + '...';
    } else {
      return input;
    }
  }

  /* 
    Prevent or enable page scrolling
    Used when a popup is active
  */
  static togglePageScroll() {
    if (!document.body.style.overflow) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow =
        document.body.style.overflow === 'visible' ? 'hidden' : 'visible';
    }
  }
}
