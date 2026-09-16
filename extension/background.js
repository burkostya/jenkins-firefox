/* Read-only injection, on explicit user action. No broad host permissions. */
browser.action.onClicked.addListener(async tab => {
  if (!tab.id) return;
  try {
    if (!/^https?:\/\//.test(tab.url || '') || !(tab.url || '').includes('/job/')) {
      throw new Error('Open a Jenkins job or build page first.');
    }
    const results = await browser.scripting.executeScript({target:{tabId:tab.id},files:['content.js']});
    const failed = results.find(result => result.error);
    if (failed) throw new Error(failed.error.message || String(failed.error));
    await browser.action.setBadgeText({tabId:tab.id,text:''});
    await browser.action.setTitle({tabId:tab.id,title:'Show local Pipeline Graph on this Jenkins job'});
  } catch (error) {
    await browser.action.setBadgeText({tabId:tab.id,text:'!'});
    await browser.action.setBadgeBackgroundColor({tabId:tab.id,color:'#b42318'});
    await browser.action.setTitle({tabId:tab.id,title:'Pipeline Graph: '+String(error.message || error)});
    console.warn('Pipeline Graph Local: '+String(error.message || error));
  }
});
