exports.id=81,exports.ids=[81],exports.modules={700:(e,t,i)=>{i.d(t,{WelcomeWebviewProvider:()=>WelcomeWebviewProvider});var n=i(1398),o=i(4293),s=i(4832),a=i(8973),r=i(3355);let g=new r.eF("welcome/configuration/update"),d=new r.m9("welcome/didChange",!0),h=new r.m9("org/settings/didChange"),c=Object.freeze({dispose:()=>{}});let WelcomeWebviewProvider=class WelcomeWebviewProvider{constructor(e,t){this.container=e,this.host=t,this._disposable=n.Disposable.from(s.H.onDidChange(this.onConfigurationChanged,this),this.container.git.onDidChangeRepositories(()=>this.notifyDidChange(),this),n.workspace.isTrusted?c:n.workspace.onDidGrantWorkspaceTrust(()=>this.notifyDidChange(),this),this.container.subscription.onDidChange(this.onSubscriptionChanged,this),(0,a.wt)(this.onContextChanged,this))}_disposable;dispose(){this._disposable.dispose()}includeBootstrap(){return this.getState()}onReloaded(){this.notifyDidChange()}getOrgSettings(){return{ai:(0,a.SD)("gitlens:gk:organization:ai:enabled",!1),drafts:(0,a.SD)("gitlens:gk:organization:drafts:enabled",!1)}}onContextChanged(e){["gitlens:gk:organization:ai:enabled","gitlens:gk:organization:drafts:enabled"].includes(e)&&this.notifyDidChangeOrgSettings()}onSubscriptionChanged(e){this.notifyDidChange(e.current)}onConfigurationChanged(e){(s.H.changed(e,"codeLens.enabled")||s.H.changed(e,"currentLine.enabled"))&&this.notifyDidChange()}onMessageReceived(e){e.method===g.method&&(0,r.Q8)(g,e,e=>this.updateConfiguration(e))}async getState(e){return{...this.host.baseWebviewState,version:this.container.version,config:{codeLens:s.H.get("codeLens.enabled",void 0,!0,!0),currentLine:s.H.get("currentLine.enabled",void 0,!0,!0)},repoFeaturesBlocked:!n.workspace.isTrusted||0===this.container.git.openRepositoryCount||this.container.git.hasUnsafeRepositories(),isTrialOrPaid:await this.getTrialOrPaidState(e),canShowPromo:await this.getCanShowPromo(e),orgSettings:this.getOrgSettings()}}async getTrialOrPaidState(e){let t=e??await this.container.subscription.getSubscription(!0);return!![o.zZ.FreePlusInTrial,o.zZ.Paid].includes(t.state)}async getCanShowPromo(e){let t=new Date("2023-12-31T07:59:00.000Z").getTime();if(Date.now()>t)return!1;let i=e??await this.container.subscription.getSubscription(!0);return!(0,o.A_)(i)}updateConfiguration(e){s.H.updateEffective(`${e.type}.enabled`,e.value)}async notifyDidChange(e){this.host.notify(d,{state:await this.getState(e)})}notifyDidChangeOrgSettings(){this.host.notify(h,{orgSettings:this.getOrgSettings()})}}}};