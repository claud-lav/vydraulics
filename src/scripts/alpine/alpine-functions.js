export function menu() {
    return {
        open: window.innerWidth >= 1280,
        openFilters: window.innerWidth >= 1280,

        init() {
            this.open = window.innerWidth >= 1280;
            this.openFilters = window.innerWidth >= 1280;
            
            window.addEventListener('resize', () => {
                this.open = window.innerWidth >= 1280;
                this.openFilters = window.innerWidth >= 1280;
            });
        }
    };
}