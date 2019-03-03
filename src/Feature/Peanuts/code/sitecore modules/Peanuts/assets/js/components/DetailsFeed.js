import { getDetailsFeed } from '../util/apiCalls';
class DetailsFeed {
    constructor() {
        this.init();
        this.isPeanutsActive = false;
        this.sxaToolbox = null;
        this.toolboxExpander = null;
        this.sxaToolboxRoot = null;
    }
    init() {
        this.getData();
        this.initComponents();
    }
    getData() {
        getDetailsFeed()
            .then((response) => {
                this.handleDetailsFeed(response);
            })
            .catch((err) => {
                // TODO handle api error
                console.log('problem getting feed');
            });
    }
    initComponents() {
        this.sxaToolbox = window.parent.document.getElementById('sxa-toolbox');
        this.toolboxExpander = this.sxaToolbox.getElementsByClassName('sxa-toolbox-expander')[0];
        this.sxaToolboxRoot = window.parent.document.getElementById('sxa-toolbox-root');
        this.createPeanutsExpander();
        this.createPeanutsToolboxElement();
    }
    createPeanutsExpander() {
        const expander = document.createElement('div');
        expander.setAttribute('class', 'peanuts-toolbox-expander');
        expander.addEventListener("click", (e) => this.clickPeanutsExpander(e));
        this.sxaToolbox.insertBefore(expander, this.toolboxExpander);
    }
    clickPeanutsExpander(e) {
        this.isPeanutsActive = !this.isPeanutsActive;
        if (this.isPeanutsActive) {
            e.target.classList.add('active');
            window.parent.document.getElementById('sxa-toolbox').classList.add('peanuts-active');
        } else {
            e.target.classList.remove('active');
            window.parent.document.getElementById('sxa-toolbox').classList.remove('peanuts-active');
        }
        this.showHideToolboxElement(this.isPeanutsActive);
    }
    createPeanutsToolboxElement() {
        const toolboxElem = document.createElement('div');
        toolboxElem.setAttribute('class', 'peanuts-toolbox-content');
        this.sxaToolbox.appendChild(toolboxElem);
    }
    showHideToolboxElement(isVisible) {
        if (isVisible) {
            window.parent.document.getElementById('sxa-toolbox-root').classList.add('hidden');
        } else {
            window.parent.document.getElementById('sxa-toolbox-root').classList.remove('hidden');
        }
    }
    handleDetailsFeed(data) {
        const mainPanel = `
            <div class="peanuts-panel childrenHavePadding">
                <div># components: ${data.overview[0].count} </div>
                <div>Local renderings: ${data.overview[0].localRenderings} </div>
                <div>Local items: ${data.overview[0].localItems} </div>
            </div>
        `;
        const componentsPanel = `
            <div class="peanuts-panel-title">
                Components
            </div>
            <div class="peanuts-panel">
                ${this.getComponentsHTML(data.details)}
            </div>
        `;
        window.parent.document.getElementsByClassName('peanuts-toolbox-content')[0].innerHTML = mainPanel + componentsPanel;
    }
    getComponentsHTML(details) {
        let componentsHTML = '';
        details.forEach((item) => {
            componentsHTML += `
                <div class="component-block">
                    <div class="component-name">
                        <span class="name" onclick="document.documentElement.scrollTop = document.getElementById('${item.renderingId}').nextSibling.nextSibling.offsetTop; setTimeout(function() {document.getElementById('${item.renderingId}').nextSibling.nextSibling.click(), 5000});">${item.name}</span>
                        <span class="component-more-info" onclick="if(this.parentElement.parentElement.classList.contains('show-info')){this.parentElement.parentElement.classList.remove('show-info')}else{this.parentElement.parentElement.classList.add('show-info')}">III</span>
                    </div>
                    <div class="component-info">
                        <div class="component-datasource">
                            <span class="peanuts-info-title">Datasource:</span> ${item.dataSourceName}
                        </div>
                        ${item.variant ? this.getVariantHTML(item.variant) : ''}
                        ${item.rules ? this.getRulesHTML(item.rules) : ''}
                    </div>
                </div>
            `;
        });
        return componentsHTML;
    }
    getVariantHTML(variant) {
        return `<div class="component-variant">
                    <span class="peanuts-info-title">Variant:</span>
                    <img src="${variant.icon}"/>
                    <span>${variant.name}</span>
                </div> `;
    }
    getRulesHTML(rules) {
        let rulesListItems = '';
        rules.forEach((rule) => {
            rulesListItems += `<li><a data-ruleID="${rule.uniqueId}">${rule.name}</a></li>`
        })
        return `<div class="component-rules">
                    <span class="peanuts-info-title">Personalisation rules:</span>
                    <ul>
                        ${rulesListItems}
                    </ul>
                </div> `;
    }
    getMoreInfoClick() {
        let moreInfoElem = document.createElement('span');
        moreInfoElem.setAttribute('class', 'component-more-info');
        moreInfoElem.addEventListener('click', (e) => this.showMoreInfo(e));
        moreInfoElem.innerHTML = "III";
        return moreInfoElem;
    }
}
export default DetailsFeed;
