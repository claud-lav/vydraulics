export function share() {
    return {
        copied: false,

        shareOn(platform) {
            const url = encodeURIComponent(this.$root.dataset.url);
            const title = encodeURIComponent(this.$root.dataset.title);
            const urls = {
                linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
            };
            if (urls[platform]) {
                window.open(urls[platform], `${platform}-share-dialog`, 'width=800,height=600');
            }
        },

        copyLink() {
            navigator.clipboard.writeText(this.$root.dataset.url).then(() => {
                this.copied = true;
                setTimeout(() => { this.copied = false; }, 2000);
            });
        },
    };
}

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