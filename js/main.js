class Carrousel {
  /**
   * This callback is displayed as a global member.
   * @callback moveCallback
   * @param {number} responseCode
   */

  /**
   *
   * @param {HTMLElement} element
   * @param {Object} options
   * @param {Object} [options.slidesToScroll=1] Number of slides to scroll
   * @param {Object} [options.slidesVisible=1] Number of slides to show
   * @param {Object} [options.loop=false] Whether to loop the slides
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign(
      {},
      {
        slidesToScroll: 1,
        slidesVisible: 1,
        loop: false,
      },
      options
    );
    let children = [].slice.call(element.children);

    this.currentSlide = 0;
    this.moveCallBacks = [];

    let ratio = children.length / this.options.slidesVisible;

    this.root = this._createDivWithClass("carrousel");
    this.container = this._createDivWithClass("carrousel__container");
    this.container.style.width = `${ratio * 100}%`;

    this.root.appendChild(this.container);

    this.element.appendChild(this.root);
    this.items = children.map((child) => {
      let item = this._createDivWithClass("carrousel__item");
      item.style.width = `${100 / this.options.slidesVisible / ratio}%`;
      item.appendChild(child);
      this.container.appendChild(item);

      return item;
    });

    this._setStyle();
    this._createNavigation();
    this.moveCallBacks.forEach((callback) => callback(0));
  }

  /**
   * Set the width style of the carrousel elements
   */
  _setStyle() {
    let ratio = this.items.length / this.options.slidesVisible;
    this.container.style.width = `${ratio * 100}%`;
    this.items.forEach(
      (item) =>
        (item.style.width = `${100 / this.options.slidesVisible / ratio}%`)
    );
  }

  _createNavigation() {
    let nextButton = this._createDivWithClass("carrousel__next");
    let prevButton = this._createDivWithClass("carrousel__prev");

    this.root.appendChild(nextButton);
    this.root.appendChild(prevButton);

    nextButton.addEventListener("click", this.next.bind(this));
    prevButton.addEventListener("click", this.prev.bind(this));

    if (this.options.loop) {
      return;
    }

    this.onMove((index) => {
      if (index === 0) {
        prevButton.classList.add("carrousel__prev--hidden");
      } else {
        prevButton.classList.remove("carrousel__prev--hidden");
      }

      if (
        this.items[this.currentSlide + this.options.slidesVisible] === undefined
      ) {
        nextButton.classList.add("carrousel__next--hidden");
      } else {
        nextButton.classList.remove("carrousel__next--hidden");
      }
    });
  }

  next() {
    this.gotoSlide(this.currentSlide + this.options.slidesToScroll);
  }

  prev() {
    this.gotoSlide(this.currentSlide - this.options.slidesToScroll);
  }

  /**
   * Move Carrousel to the target slide
   * @param {number} index
   */
  gotoSlide(index) {
    if (index < 0) {
      index = this.items.length - this.options.slidesVisible;
    } else if (
      index >= this.items.length ||
      (this.items[this.currentSlide + this.options.slidesVisible] ===
        undefined &&
        index > this.currentSlide)
    ) {
      index = 0;
    }

    let translateX = (index * 100) / this.items.length;
    this.container.style.transform = `translate3d(${-translateX}%, 0, 0)`;
    this.currentSlide = index;
    this.moveCallBacks.forEach((callback) => callback(index));
  }

  /**
   *
   * @param {moveCallback} callback
   */
  onMove(callback) {
    this.moveCallBacks.push(callback);
  }

  /**
   *
   * @param {string} className
   * @returns {HTMLElement}
   */
  _createDivWithClass(className) {
    let div = document.createElement("div");
    div.classList.add(className);
    return div;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Carrousel(document.querySelector("#carrousel1"), {
    slidesVisible: 3,
    slidesToScroll: 2,
  });
  new Carrousel(document.querySelector("#carrousel2"), {
    slidesVisible: 3,
    slidesToScroll: 2,
    loop: true,
  });
});
