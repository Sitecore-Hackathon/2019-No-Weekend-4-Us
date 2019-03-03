
import 'babel-polyfill';
import DetailsFeed from './components/DetailsFeed';

const interval = setInterval(() => {
    if (document.readyState === "complete" && window.parent.document.readyState === "complete") {
        clearInterval(interval);
        initializeDetailsFeed();
    }
}, 100);

const initializeDetailsFeed = () => {
    window.DetailsFeed = new DetailsFeed();
}

window.initializeDetailsFeed = initializeDetailsFeed;