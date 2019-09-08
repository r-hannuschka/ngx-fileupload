'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ngx-fileupload documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/NgxFileUploadModule.html" data-type="entity-link">NgxFileUploadModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' : 'data-target="#xs-components-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' :
                                            'id="xs-components-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' }>
                                            <li class="link">
                                                <a href="components/NgxFileUploadComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NgxFileUploadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NgxFileUploadItemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NgxFileUploadItemComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' : 'data-target="#xs-directives-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' :
                                        'id="xs-directives-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' }>
                                        <li class="link">
                                            <a href="directives/NgxFileUploadDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">NgxFileUploadDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' : 'data-target="#xs-pipes-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' :
                                            'id="xs-pipes-links-module-NgxFileUploadModule-401f373af39ac454591fcd324ff797b2"' }>
                                            <li class="link">
                                                <a href="pipes/ToArrayPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToArrayPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AndValidator.html" data-type="entity-link">AndValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileUpload.html" data-type="entity-link">FileUpload</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupedValidator.html" data-type="entity-link">GroupedValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrValidator.html" data-type="entity-link">OrValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadControl.html" data-type="entity-link">UploadControl</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadModel.html" data-type="entity-link">UploadModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationBuilder.html" data-type="entity-link">ValidationBuilder</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/FileUploadItemContext.html" data-type="entity-link">FileUploadItemContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDataNode.html" data-type="entity-link">IDataNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadData.html" data-type="entity-link">UploadData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadOptions.html" data-type="entity-link">UploadOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadResponse.html" data-type="entity-link">UploadResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadValidation.html" data-type="entity-link">UploadValidation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationErrors.html" data-type="entity-link">ValidationErrors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Validator.html" data-type="entity-link">Validator</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});