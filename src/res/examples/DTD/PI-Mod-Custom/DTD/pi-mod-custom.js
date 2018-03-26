// XMetaL Script Language JSCRIPT:

//========================================================================
// DocBook Sample Customization
//
// Copyright 2009  JustSystems Canada Inc. 
//
// This XMetaL extension is the property of JustSystems Canada Inc.
// and its licensors and is protected by copyright.   Modifications of
// this extension may invalidate any support that you may be entitled to.
// Any reproduction in whole or in part is strictly prohibited. 
//========================================================================


//========================================================================
// DOCBOOKHANDLER CLASS:
//========================================================================
function DocBookHandler(version)
{
  // Add members to DocBookHandler type
  this.fDocBookVersion          = version;
  this.fRootElemName            = "article";
  this.fSectionElemName         = "section";
  this.fIdAttrName              = "xml:id";
  this.fCrossRefElemName        = "xref";
  this.fLinkEndAttrName         = "linkend";
  this.fXIncludeShowingPropKey  = "__DOCBOOK_XINCLUDES_SHOWING__";
  this.fDidUpdateXIncludeOnce   = false;  // Help user get xincludes showing
  this.fShowXIncludesUponOpen   = false;  // Default to no showing XInclude targets on first open
  this.fBaseCssToAppendIndex    = 1;      // Default to using docbook_example1.css
  this.fTotalCssExamples        = 3;      // 3 example CSS files for showing DocBook
  this.fCssToAppend             = ""; 
  this.fIndexMarkersOn          = false; 
}
//========================================================================
// FACTORY ACCESSORS:
//========================================================================
DocBookHandler.prototype.getRootElemName = function()
{
  return this.fRootElemName;
}
//========================================================================
DocBookHandler.prototype.getSectionElemName = function()
{
  return this.fSectionElemName;
}
//========================================================================
// MENU & TOOLBAR HELPERS
//========================================================================
DocBookHandler.prototype.OnLocalCommandBarsComplete = function(cmdBars)
{
  // Check for presence of DocBook menu items and add them
  // if they are not present...
  //
  try {
    if (!this.areMenuItemsPresent()) {
      this.addMenuItems();
      this.addToggleInlinesButtons();
    }
    
  } catch (e) {
    Application.Alert(DocBook.Strings.eMakingToolbarsAndMenus + e.description);
  }
}
//========================================================================
DocBookHandler.prototype.areMenuItemsPresent = function()
{
  // Find if "View" presents
  var viewCtls = getMenuUtilities().getViewMenuButtonControls();
  if (viewCtls == null) {
    return false;
  }
    
  // Check if DocBook item are already in menu item "View"
  var viewCtl;
  for (var i = 1; i <= viewCtls.Count; i++) {
    viewCtl = viewCtls.Item(i);
    if (viewCtl.OnAction.lastIndexOf("__DOCBOOK_SHOW_ALL_XINCLUDES__") != -1) {
      return true;
    }
    if (viewCtl.OnAction.lastIndexOf("__DOCBOOK_HIDE_ALL_XINCLUDES__") != -1) {
      return true;
    }
  }
  return false;
}
//========================================================================
DocBookHandler.prototype.addMenuItems = function()
{
  // Add DocBook menu Items
  //
  // Edit:
  //  ...
  //  Paste                              (XMAU)
  //  ----
  //  Refresh and Show All XML Inclusions\tF5 (DocBook)
  //
  //
  // View:
  //  ...
  //  ----
  //  Hide XML Inclusions                (DocBook)
  //  Hide Inline Images                 (XMAU)
  //  Hide Table Grid                    (XMAU)
  //  ...
  //  ----
  //  Structure View                     (XMAU)
  //  Attribute Inspector                (XMAU)
  //  Element List                       (XMAU)
  //  Validation Log                     (XMAU)
  //  XML Inclusion Log                  (DocBook)
  //  ...
  //
  // DocBook:
  // <!-- COMMON ELEMENTS -->
  // Common > 
  //   Insert_Para
  //   Insert_Note
  //   Insert_BlockQuote
  //   Insert_Example
  //   Insert_LiteralLayout
  //   Insert_ProgramListing
  // <!-- SECTIONS -->
  // Sections >
  //   Insert_TopLevelSection
  //   Insert_SectionBeforeThisOne
  //   Insert_SectionAfterThisOne
  //   Insert_ChildSection
  //   JoinSectionToPreceding
  //   Move_SectionDown
  //   Move_SectionUp
  //   Promote_Section
  //   Demote_Section
  //   Split_Section
  // <!-- TOGGLING -->
  // Toggling >
  //   Toggle_Bold
  //   Toggle_Italic
  //   Toggle_Underline
  //   Toggle_Superscript
  //   Toggle_Teletype
  // <!-- IMAGES & LINKS -->
  // Images & Links >
  //   Insert_Image
  //   Insert_InlineImage
  //   Insert_Figure
  //   Insert_ULink
  //   Insert_Link
  //   Insert_XRef
  // <!-- META INFO -->
  // Miscellaneous >
  //   Insert_Author
  //   Insert_BiblioItem
  //   Insert_Footnote
  //   Insert_FootnoteRef
  //   Insert_Keyword
  // <!-- DEMONSTRATIONS -->
  // Document Display >
  //   Toggle_IndexMarker_Display
  //   Use_CSS_Example1
  //   Use_CSS_Example2
  //   Use_CSS_Example3
  //
  // Help:
  //  ...
  //  About XMetaL Author                 (XMAU)
  //  About XMetaL Author DocBook Sample  (DocBook)


  ////////////////////////////////////////////////////////
  // "EDIT" MENU
  //
  // Find "Edit" menu
  var editCtls = getMenuUtilities().getMenuButtonControlsById("-2147483646");
  if (editCtls == null) {
    return -1;
  }
  // Find "Paste" by looking for second 'BeginGroup'
  // which will give use offset to insert new menu item...
  var editCtl, insertIx = 0;
  for (var twoSeps = 0; twoSeps < 2; twoSeps++) {
    insertIx++;
    for ( ; insertIx < editCtls.Count; insertIx++) {
      editCtl = editCtls.Item(insertIx);
      if (editCtl.BeginGroup)
        break;
      editCtl = null;
    }
  }
  // Add "Refresh All XIncludes"...
  var onAction = "__DOCBOOK_REFRESH_ALL_XINCLUDES__";
  var caption  = DocBook.Strings.cbccRefreshShowAllXIncludesWithShortcut;
  var descText = DocBook.Strings.cbcdRefreshShowAllXIncludesWithShortcut;
  getMenuUtilities().addNewMenuItem(editCtls,
                                    insertIx,
                                    onAction,
                                    caption,
                                    descText,
                                    true,
                                    0);


  ////////////////////////////////////////////////////////
  // "VIEW" MENU
  //
  // Find "View" menu
  var viewCtls = getMenuUtilities().getViewMenuButtonControls();
  if (viewCtls == null) {
    return -1;
  }
  // Find "Hide Inline Images" by looking for first 'BeginGroup'
  // which will give use offset to insert new menu item...
  var viewCtl, insertIx;
  for (insertIx = 1; insertIx < viewCtls.Count; insertIx++) {
    viewCtl = viewCtls.Item(insertIx);
    if (viewCtl.BeginGroup)
      break;
    viewCtl = null;
  }
  if (viewCtl) {
    viewCtl.BeginGroup = false;  // Turn-off "BeginGroup" for "Hide Inline Images"
                                 // since it will be moved to new menu item
  }
  // Add "Show XIncludes" versus "Hide XIncludes" depends on startup state...
  var onAction = (this.fShowXIncludesUponOpen) ? "__DOCBOOK_HIDE_ALL_XINCLUDES__"    : "__DOCBOOK_SHOW_ALL_XINCLUDES__";
  var caption  = (this.fShowXIncludesUponOpen) ? DocBook.Strings.cbccHideAllXIncludes : DocBook.Strings.cbccShowAllXIncludes;
  var descText = (this.fShowXIncludesUponOpen) ? DocBook.Strings.cbcdHideAllXIncludes : DocBook.Strings.cbcdShowAllXIncludes;
  getMenuUtilities().addNewMenuItem(viewCtls,
                                    insertIx,
                                    onAction,
                                    caption,
                                    descText,
                                    true,
                                    0);
  // Find "Validation Log" by looking for first 'Id'
  // which will give use offset (+1) to insert new menu item...
  for ( ; insertIx < viewCtls.Count; insertIx++) {
    viewCtl = viewCtls.Item(insertIx);
    if (viewCtl.Id == "0X4EF5" || viewCtl.Id == 20213)
      break;
    viewCtl = null;
  }
  // Add "XML Inclusion Log" after "Validation Log"...
  var onAction = "__DOCBOOK_SHOW_XML_INCLUSION_LOG__";
  var caption  = DocBook.Strings.cbccShowXIncludeLog;
  var descText = DocBook.Strings.cbcdShowXIncludeLog;
  getMenuUtilities().addNewMenuItem(viewCtls,
                                    insertIx + 1,
                                    onAction,
                                    caption,
                                    descText,
                                    false,
                                    0);


  ////////////////////////////////////////////////////////
  // "DOCBOOK" MENU BUTTON
  var insertIx = getMenuUtilities().getMenuButtonIndexById(getMenuUtilities().getWindowMenuButtonId());
  var docbookMenuBtn = getMenuUtilities().addNewMenu(insertIx, "XMSAMPLE_DOCBOOK", DocBook.Strings.cbccDocBookMenuButton);
  var docbookMenuBtnCtls = docbookMenuBtn.Controls;
  if (docbookMenuBtnCtls == null) {
    return -1;
  }
  insertIx = 1;
  // APPEND SUBMENUS OF DOCBOOK STUFF
  //
  // COMMON ELEMENTS
  var subMenuCtls = getMenuUtilities().addNewSubMenu(docbookMenuBtnCtls, insertIx++, DocBook.Strings.cbccCommonSubMenu, false/*beginGroup*/, 0/*faceId*/)
  var insertSubIx = 1;
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_Note",           DocBook.Strings.cbccInsertNote,           DocBook.Strings.cbcdInsertNote,           false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_BlockQuote",     DocBook.Strings.cbccInsertBlockQuote,     DocBook.Strings.cbcdInsertBlockQuote,     false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_Example",        DocBook.Strings.cbccInsertExample,        DocBook.Strings.cbcdInsertExample,        false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_LiteralLayout",  DocBook.Strings.cbccInsertLiteralLayout,  DocBook.Strings.cbcdInsertLiteralLayout,  false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_ProgramListing", DocBook.Strings.cbccInsertProgramListing, DocBook.Strings.cbccInsertProgramListing, false, 0);
  // SECTIONS
  var subMenuCtls = getMenuUtilities().addNewSubMenu(docbookMenuBtnCtls, insertIx++, DocBook.Strings.cbccSectionsSubMenu, false/*beginGroup*/, 0/*faceId*/);
  var insertSubIx = 1;
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_TopLevelSection",      DocBook.Strings.cbccInsertTopLevelSection, DocBook.Strings.cbcdInsertTopLevelSection, false,  0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_SectionBeforeThisOne", DocBook.Strings.cbccInsertSectionBefore,   DocBook.Strings.cbcdInsertSectionBefore,   false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_SectionAfterThisOne",  DocBook.Strings.cbccInsertSectionAfter,    DocBook.Strings.cbcdInsertSectionAfter,    false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_ChildSection",         DocBook.Strings.cbccInsertSubSection,      DocBook.Strings.cbcdInsertSubSection,      false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "JoinSectionToPreceding",      DocBook.Strings.cbccJoinSectionToPrevious, DocBook.Strings.cbcdJoinSectionToPrevious, false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Move_SectionDown",            DocBook.Strings.cbccMoveSectionDown,       DocBook.Strings.cbcdMoveSectionDown,       false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Move_SectionUp",              DocBook.Strings.cbccMoveSectionUp,         DocBook.Strings.cbcdMoveSectionUp,         false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Promote_Section",             DocBook.Strings.cbccPromoteSection,        DocBook.Strings.cbcdPromoteSection,        false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Demote_Section",              DocBook.Strings.cbccDemoteSection,         DocBook.Strings.cbcdDemoteSection,         false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Split_Section",               DocBook.Strings.cbccSplitSection,          DocBook.Strings.cbcdSplitSection,          false, 0);
  // TOGGLING
  var subMenuCtls = getMenuUtilities().addNewSubMenu(docbookMenuBtnCtls, insertIx++, DocBook.Strings.cbccTogglingSubMenu, false/*beginGroup*/, 0/*faceId*/)
  var insertSubIx = 1;
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Toggle_Bold",        DocBook.Strings.cbccToggleBoldWithShortcut,      DocBook.Strings.cbcdToggleBoldWithShortcut,      false, Application.makeFaceId("General (Custom)", 1, 1));
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Toggle_Italic",      DocBook.Strings.cbccToggleItalicWithShortcut,    DocBook.Strings.cbcdToggleItalicWithShortcut,    false, Application.makeFaceId("General (Custom)", 1, 3));
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Toggle_Underline",   DocBook.Strings.cbccToggleUnderlineWithShortcut, DocBook.Strings.cbcdToggleUnderlineWithShortcut, false, Application.makeFaceId("General (Custom)", 1, 8));
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Toggle_Teletype",    DocBook.Strings.cbccToggleTeletype,              DocBook.Strings.cbcdToggleTeletype,              false, Application.makeFaceId("General (Custom)", 1, 7));
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Toggle_Superscript", DocBook.Strings.cbccToggleSuperscript,           DocBook.Strings.cbcdToggleSuperscript,           true,  Application.makeFaceId("General (Custom)", 1, 10));
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Toggle_Subscript",   DocBook.Strings.cbccToggleSubscript,             DocBook.Strings.cbcdToggleSubscript,             false, Application.makeFaceId("General (Custom)", 1, 9));
  // IMAGES & LINKS
  var subMenuCtls = getMenuUtilities().addNewSubMenu(docbookMenuBtnCtls, insertIx++, DocBook.Strings.cbccImagesAndLinksSubMenu, false/*beginGroup*/, 0/*faceId*/)
  var insertSubIx = 1;
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_Image",       DocBook.Strings.cbccInsertImage,       DocBook.Strings.cbcdInsertImage,       false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_InlineImage", DocBook.Strings.cbccInsertInlineImage, DocBook.Strings.cbcdInsertInlineImage, false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_Figure",      DocBook.Strings.cbccInsertFigure,      DocBook.Strings.cbcdInsertFigure,      false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_ULink",       DocBook.Strings.cbccInsertULink,       DocBook.Strings.cbcdInsertULink,       false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_Link",        DocBook.Strings.cbccInsertLink,        DocBook.Strings.cbcdInsertLink,        false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_XRef",        DocBook.Strings.cbccInsertXRef,        DocBook.Strings.cbcdInsertXRef,        false, 0);
  // META INFO
  var subMenuCtls = getMenuUtilities().addNewSubMenu(docbookMenuBtnCtls, insertIx++, DocBook.Strings.cbccMiscellaneousSubMenu, false/*beginGroup*/, 0/*faceId*/)
  var insertSubIx = 1;
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_Author",      DocBook.Strings.cbccInsertAuthor,      DocBook.Strings.cbcdInsertAuthor,      false,  0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_BiblioItem",  DocBook.Strings.cbccInsertBiblioItem,  DocBook.Strings.cbcdInsertBiblioItem,  false,  0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_Footnote",    DocBook.Strings.cbccInsertFootnote,    DocBook.Strings.cbcdInsertFootnote,    false,  0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_FootnoteRef", DocBook.Strings.cbccInsertFootnoteRef, DocBook.Strings.cbcdInsertFootnoteRef, false,  0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "Insert_Keyword",     DocBook.Strings.cbccInsertKeyword,     DocBook.Strings.cbcdInsertKeyword,     false,  0);
  // DOCUMENT DISPLAY
  var subMenuCtls = getMenuUtilities().addNewSubMenu(docbookMenuBtnCtls, insertIx++,  DocBook.Strings.cbccDocumentDisplaySubMenu, true/*beginGroup*/, 0/*faceId*/)
  var insertSubIx = 1;
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "__DOCBOOK_TOGGLE_INDEXMARKER_VISIBILITY__", DocBook.Strings.cbccShowIndexTermsAndFN, DocBook.Strings.cbcdShowIndexTermsAndFN, false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "__DOCBOOK_CSS_EXAMPLE1__", DocBook.Strings.cbccSwitchToCssExample1, DocBook.Strings.cbcdSwitchToCssExample1, true, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "__DOCBOOK_CSS_EXAMPLE2__", DocBook.Strings.cbccSwitchToCssExample2, DocBook.Strings.cbcdSwitchToCssExample2, false, 0);
  getMenuUtilities().addNewMenuItem(subMenuCtls, insertSubIx++, "__DOCBOOK_CSS_EXAMPLE3__", DocBook.Strings.cbccSwitchToCssExample3, DocBook.Strings.cbcdSwitchToCssExample3, false, 0);
  // ABOUT
//  getMenuUtilities().addNewMenuItem(docbookMenuBtnCtls, insertIx++, "About_DocBook_Sample", DocBook.Strings.cbccAboutDocBookSample, DocBook.Strings.cbcdAboutDocBookSample, true,  0);
}
//========================================================================
DocBookHandler.prototype.addToggleInlinesButtons = function()
{
  // Get built-in 'Formatting' toolbar and adjust the OnAction property
  // to run our custom DocBook macro for bold, italic and underline.
  //
  var formatBar = Application.CommandBars(DocBook.Strings.cbFormatting);
  if (!formatBar)
    return;
    
  var formatCtls = formatBar.Controls;
  var lastToggleIx = -1;
  for (var i = 0; i < formatCtls.Count; i++) {
    var formatCtl = formatCtls.Item(i);
    var newFormatCtl = null;
    
    if (!formatCtl)
      continue;
      
    switch (formatCtl.Id) {
    case /*"0X4FB3"*/ 20403: 
      lastToggleIx = i + 1;
      newFormatCtl = formatCtls.Add(sqcbcTypeButton, -1, lastToggleIx);
      newFormatCtl.OnAction        = "Toggle_Bold";
      newFormatCtl.FaceId          = formatCtl.Id; // Builtin control's Id value is its FaceId (i.e. icon)
      newFormatCtl.DescriptionText = DocBook.Strings.cbcdToggleBold;
      newFormatCtl.TooltipText     = DocBook.Strings.cbctToggleBold;
      break;
    case /*"0X4FBB"*/ 20411: 
      lastToggleIx = i + 1;
      newFormatCtl = formatCtls.Add(sqcbcTypeButton, -1, lastToggleIx);
      newFormatCtl.OnAction        = "Toggle_Italic";
      newFormatCtl.FaceId          = formatCtl.Id;
      newFormatCtl.DescriptionText = DocBook.Strings.cbcdToggleItalic;
      newFormatCtl.TooltipText     = DocBook.Strings.cbctToggleItalic;
      break;
    case /*"0X4FC0"*/ 20416:
      lastToggleIx = i + 1;
      newFormatCtl = formatCtls.Add(sqcbcTypeButton, -1, lastToggleIx);
      newFormatCtl.OnAction        = "Toggle_Underline";
      newFormatCtl.FaceId          = formatCtl.Id;
      newFormatCtl.DescriptionText = DocBook.Strings.cbcdToggleUnderline;
      newFormatCtl.TooltipText     = DocBook.Strings.cbctToggleUnderline;
      break;
    default:
      break;
    }

    // If we made a new control, that means it is meant to replace
    // the current build control...so, delete the current. 
    //
    if (newFormatCtl) {
      formatCtl.Delete();
    }
  }
  
  // Append teletype, subscript and superscript toggle buttons
  //
  if (lastToggleIx > 0) {
    newFormatCtl = formatCtls.Add(sqcbcTypeButton, -1, ++lastToggleIx);
    newFormatCtl.OnAction        = "Toggle_Teletype";
    newFormatCtl.FaceId          = Application.makeFaceId("General (Custom)", 1, 7);
    newFormatCtl.DescriptionText = DocBook.Strings.cbcdToggleTeletype;
    newFormatCtl.TooltipText     = DocBook.Strings.cbctToggleTeletype;

    newFormatCtl = formatCtls.Add(sqcbcTypeButton, -1, ++lastToggleIx);
    newFormatCtl.OnAction        = "Toggle_Superscript";
    newFormatCtl.FaceId          = Application.makeFaceId("General (Custom)", 1, 10);
    newFormatCtl.DescriptionText = DocBook.Strings.cbcdToggleSuperscript;
    newFormatCtl.TooltipText     = DocBook.Strings.cbctToggleSuperscript;
    newFormatCtl.BeginGroup      = true;

    newFormatCtl = formatCtls.Add(sqcbcTypeButton, -1, ++lastToggleIx);
    newFormatCtl.OnAction        = "Toggle_Subscript";
    newFormatCtl.FaceId          = Application.makeFaceId("General (Custom)", 1, 9);
    newFormatCtl.DescriptionText = DocBook.Strings.cbcdToggleSubscript;
    newFormatCtl.TooltipText     = DocBook.Strings.cbctToggleSubscript;
  }
}
//========================================================================
DocBookHandler.prototype.adjustShowHideAllXIncludesMenuItem = function(xiShowing)
{
  var viewCtls = getMenuUtilities().getViewMenuButtonControls();
  if (viewCtls == null) {
    return;
  }
    
  var viewCtl;
  for (var i = 1; i <= viewCtls.Count; i++) {
    viewCtl = viewCtls.Item(i);
    if (viewCtl.OnAction.lastIndexOf("__DOCBOOK_SHOW_ALL_XINCLUDES__") != -1) {
      break;
    }
    if (viewCtl.OnAction.lastIndexOf("__DOCBOOK_HIDE_ALL_XINCLUDES__") != -1) {
      break;
    }
    viewCtl = null;
  }
  if (!viewCtl) {
    return;
  }
  
  viewCtl.OnAction        = (xiShowing) ? "__DOCBOOK_HIDE_ALL_XINCLUDES__"    : "__DOCBOOK_SHOW_ALL_XINCLUDES__";
  viewCtl.Caption         = (xiShowing) ? DocBook.Strings.cbccHideAllXIncludes : DocBook.Strings.cbccShowAllXIncludes;
  viewCtl.DescriptionText = (xiShowing) ? DocBook.Strings.cbcdHideAllXIncludes : DocBook.Strings.cbcdShowAllXIncludes;
  }
//========================================================================
// DOCBOOK-OPEN HANDLER
//========================================================================
DocBookHandler.prototype.OnDocumentOpenComplete = function(xmDoc)
{
  // Setup custom property to track hide/show XInclude state
  xmDoc.CustomDocumentProperties.Add(this.fXIncludeShowingPropKey, (this.fShowXIncludesUponOpen) ? "true" : "false");
  
  // TODO: Configure attributes for 'custom-edit' action...
}
//========================================================================
// DOCBOOK CUSTOM EDIT-ATTRIBUTE HANDLER
//========================================================================
DocBookHandler.prototype.OnCustomEditAttribute = function(xmDoc, attrNode, attrName, attrValue)
{
  // TODO: Dispatch 'custom-edit' action for attribute
}
//========================================================================
// DOCBOOK TAGS-ON/NORMAL VIEW HANDLERS
//========================================================================
DocBookHandler.prototype.OnRefreshCssStyle = function(xmApp, xmDoc)
{
  // Tell XMetaL the CSS we want it to use.  This method is called
  // by the On_View_RefreshCssStyles event macro.  Beware that the
  // event macro may be trigger by other customizations or APIs.
  //
  if (!XM.String.hasContent(this.fCssToAppend)) {
    this.initializeCSS(xmApp, xmDoc);
  }
  xmDoc.RefreshCssStyleToAppend(this.fCssToAppend);
}
//==========================================================================
DocBookHandler.prototype.initializeCSS = function(xmApp, xmDoc)
{
  // Get all the CSS as string to use in Tags On/Normal view.
  //
  this.fCssToAppend  = xmApp.FileToString(this.getMainCssToAppendFileName(xmDoc));
  this.fCssToAppend += xmApp.FileToString(this.getIndexMarkerCssToAppendFileName(xmDoc));
  this.deployPreviewCSS(xmApp, xmDoc);
}
//==========================================================================
DocBookHandler.prototype.deployPreviewCSS = function(xmApp, xmDoc)
{
  // multipleOutput.mcr is used for Page Preview mode and it relies upon
  // CSStoXSL.dll to make a XSL transform.  The XSL is created by walking
  // the active document's DOMCSSStyleSheet object.  Currently, that object
  // only sees the customization's main CSS file and not the CSS injected
  // via scripting (i.e. ActiveDocument.RefreshCssStylesToAppend).  
  //
  // For preview to work properly, we will copy over the appropriate XSL
  // for the active dynamic CSS in-use.  The preview XSL is deployed to either
  // the per-user folder OR Author\Display folder according to the UserSettingMode.
  //
  var appService = getXMAppService();
  if (appService && appService.FileService) {
    var fso = appService.FileService.fso();

    var xslForCssSourceDir = this.getSourceCssXslForPreviewFileName(xmApp, xmDoc);
    var xslForCssTargetDir = this.getTargetCssXslForPreviewFileName(xmApp, xmDoc);
    fso.CopyFile(xslForCssSourceDir,
                 xslForCssTargetDir,
                 true/*overwrite*/);	

    var xslForHtmlSourceDir = this.getSourceHtmlXslForPreviewFileName(xmApp, xmDoc);
    var xslForHtmlTargetDir = this.getTargetHtmlXslForPreviewFileName(xmApp, xmDoc);
    fso.CopyFile(xslForHtmlSourceDir,
                 xslForHtmlTargetDir,
                 true/*overwrite*/);	
  }
}
//==========================================================================
DocBookHandler.prototype.applyCSS = function(xmApp, xmDoc, newCssIndex)
{
  // Apply a different main CSS to Tags On/Normal view.
  //
  if (newCssIndex < 1 || newCssIndex > this.fTotalCssExamples)
    return;
    

  // Load of the CSS into a string buffer (fCssToAppend).
  //
  this.fBaseCssToAppendIndex = newCssIndex;
  this.fCssToAppend  = xmApp.FileToString(this.getMainCssToAppendFileName(xmDoc));
  this.fCssToAppend += xmApp.FileToString(this.getIndexMarkerCssToAppendFileName(xmDoc));


  // Update page-preview CSS too
  this.deployPreviewCSS(xmApp, xmDoc);

  
  // Tell XMetaL to reload the CSS for Tags On/Normal view.  The RefreshCssStyle api
  // will cause XMetaL to fire the 'On_View_RefreshCssStyle' event macro.  That macro
  // will call the OnRefreshCssStyle method above.
  //
  xmDoc.RefreshCssStyle();
}
//========================================================================
DocBookHandler.prototype.toggleIndexMarkersCSS = function(xmApp, xmDoc)
{
  // Toggle index marker/footnote visibility flag and re-apply CSS
  //
  this.fIndexMarkersOn = !this.fIndexMarkersOn;
  this.applyCSS(xmApp, xmDoc, this.fBaseCssToAppendIndex);
}
//========================================================================
DocBookHandler.prototype.getMainCssToAppendFileName = function(xmDoc)
{
  // Return main CSS file name give current setting.
  // CSS file is located beside the rules/dtd file...
  //
  var rulesFN = xmDoc.RulesFile;
  var cssFN = rulesFN.substr(0, rulesFN.lastIndexOf("\\"))
              + "\\docbookxi_example"
              + this.fBaseCssToAppendIndex
              + ".css";
  return cssFN;
}
//========================================================================
DocBookHandler.prototype.getIndexMarkerCssToAppendFileName = function(xmDoc)
{
  // Return index marker/footnote CSS file name give current setting.
  // CSS file is located beside the rules/dtd file...
  //
  var rulesFN = xmDoc.RulesFile;
  var cssFN = rulesFN.substr(0, rulesFN.lastIndexOf("\\"))
              + "\\docbookxi_indexmarker";
  if (this.fIndexMarkersOn) {
    cssFN += "_on.css";
  } else {
    cssFN += "_off.css";
  }
  return cssFN;
}
//========================================================================
DocBookHandler.prototype.getSourceCssXslForPreviewFileName = function(xmApp, xmDoc)
{
  // Return XSL file name given the currently active CSS.
  // XSL file is located beside the rules/dtd file...
  //
  var rulesFN = xmDoc.RulesFile;
  var xslFN = rulesFN.substr(0, rulesFN.lastIndexOf("\\"))
              + "\\docbookxi_HTML_Style."
              + this.fBaseCssToAppendIndex
              + ".xsl";
  return xslFN;
}
//========================================================================
DocBookHandler.prototype.getSourceHtmlXslForPreviewFileName = function(xmApp, xmDoc)
{
  // Return XSL file name for common HTML transformations.
  // XSL file is located beside the rules/dtd file...
  //
  var rulesFN = xmDoc.RulesFile;
  var xslFN = rulesFN.substr(0, rulesFN.lastIndexOf("\\"))
              + "\\docbookxi_HTML.xsl";
  return xslFN;
}
//========================================================================
DocBookHandler.prototype.getTargetCssXslForPreviewFileName = function(xmApp, xmDoc)
{
  // Return XSL file name given the currently active CSS.
  // XSL file is located beside the rules/dtd file...
  //
  // TODO: Make connector-deployable...cannot have 'folder'!!
  //
  var xslFN = "";
  var appService = getXMAppService();
  
  if (appService && appService.FileService) {
    var fso = appService.FileService.fso();

    // Per-user, limited user mode
    if (xmApp.UserSettingMode == "per_user") {
      var xslTargetDir = appService.SettingsService.getMUSPath();
      xslTargetDir = fso.BuildPath(xslTargetDir, "\\Display");
      xslFN = fso.BuildPath(xslTargetDir, "docbookxi_HTML_Style.xsl");
     
    // Local-admin mode
    } else {
      var rulesFN = xmDoc.RulesFile;
      xslFN = rulesFN.substr(0, rulesFN.lastIndexOf("\\")) + "\\docbookxi_HTML_Style.xsl";
    }
  }
  return xslFN;
}
//========================================================================
DocBookHandler.prototype.getTargetHtmlXslForPreviewFileName = function(xmApp, xmDoc)
{
  // Return XSL file name for common HTML transformations.
  // XSL file is located beside the rules/dtd file...
  //
  var xslFN = "";
  var appService = getXMAppService();
  
  if (appService && appService.FileService) {
    var fso = appService.FileService.fso();

    // Per-user, limited user mode
    if (xmApp.UserSettingMode == "per_user") {
      var xslTargetDir = appService.SettingsService.getMUSPath();
      xslTargetDir = fso.BuildPath(xslTargetDir, "\\Display");
      xslFN = fso.BuildPath(xslTargetDir, "docbookxi_HTML.xsl");
     
     // Local-admin mode
     } else {
       var rulesFN = xmDoc.RulesFile;
       xslFN = rulesFN.substr(0, rulesFN.lastIndexOf("\\")) + "\\docbookxi_HTML.xsl";
     }
  }
  return xslFN;
}
//========================================================================
// DOCBOOK RIGHT-CLICK MENU EXTENDER
//========================================================================
// XMetaL Script Language JSCRIPT:
DocBookHandler.prototype.OnContextMenu = function(cmdBarPopup, xmDoc)
{
  if (!cmdBarPopup || !xmDoc)
    return;

  var cbpControls = cmdBarPopup.Controls;
  if (!cbpControls)
    return;

  var range    = xmDoc.Range;
  var domNode  = range.ContainerNode;
  var isXInode = this.isNodeOrAncestorXInclude(xmDoc, domNode);
  var isXrefLE = (domNode.nodeType == XM.XML.NodeType.DOMElement
					&& domNode.hasAttribute(this.fLinkEndAttrName)) ? true : false;


  // If XInclude, prepend Show, Hide, Open XInclude operations...
  //
  if (isXInode) {
  
    var isXINodeShowing   = this.getNearestXIncludeNode(xmDoc, domNode).transState == sqXISourceT;
    var isXINodeParseText = this.getNearestXIncludeNode(xmDoc, domNode).getAttribute("parse") == "text";
    
    // ...but insert after more important right-click actions for
    // misspelt words and such.  Need to check if any important items
    // at top of menu..
    var pos = 1;
    var hadImportantItem = false;
    for (var i = 1; i <= cbpControls.Count; i++) {
      var popup = cbpControls.Item(i);
      if (!Application.CommandBars.IsImportantContextPopup(popup)) {
        pos = i;
        hadImportantItem = (pos > 1) ? true : false; // Atleast one spellcheck suggestion
        break;
      }
    }
    
    // ...add show/hide items
    if (!isXINodeShowing) {
      getMenuUtilities().addNewMenuItem(cbpControls,
                               pos++,
                               "__DOCBOOK_REFRESH_XINCLUDE__", //"__DOCBOOK_SHOW_XINCLUDE__",
                               DocBook.Strings.cbccShowXIncludeWithAccel,
                               DocBook.Strings.cbcdShowXIncludeWithAccel,
                               hadImportantItem,
                               0);
    } else {
      getMenuUtilities().addNewMenuItem(cbpControls,
                               pos++,
                               "__DOCBOOK_HIDE_XINCLUDE__",
                               DocBook.Strings.cbccHideXIncludeWithAccel,
                               DocBook.Strings.cbcdHideXIncludeWithAccel,
                               hadImportantItem,
                               0);
    }
    
    // ...add open target item but only for parse=='xml'
    if (!isXINodeParseText) {
      getMenuUtilities().addNewMenuItem(cbpControls,
                               pos++,
                               "__DOCBOOK_OPEN_XINCLUDE_TARGET__",
                               DocBook.Strings.cbccOpenXIncludeTargetWithAccel,
                               DocBook.Strings.cbcdOpenXIncludeTargetWithAccel,
                               false,
                               0);
    }
    
    // ...add final separate to next grouping
    var nextMenuItem = cbpControls.Item(pos);
    if (nextMenuItem) {
      nextMenuItem.BeginGroup = true;
    }
  }
  
  
  // If "xref" with "linkend", provide jump-to option
  if (isXrefLE) {
    getMenuUtilities().addNewMenuItem(cbpControls,
                               1,
                               "__DOCBOOK_JUMPTO_LINKEND__",
                               DocBook.Strings.cbccJumpToLinkendWithAccel,
                               DocBook.Strings.cbcdJumpToLinkendWithAccel,
                               false,
                               0);
    var nextMenuItem = cbpControls.Item(2);
    if (nextMenuItem) {
      nextMenuItem.BeginGroup = true;
    }
  }
}
//========================================================================
// DOCBOOK CUSTOM MACRO ENABLE/DISABLE HANDLER
//========================================================================
DocBookHandler.prototype.OnUpdateUI = function(xmApp, xmDoc)
{
  // Is there a document open/active?
  //
  if (xmDoc && (xmDoc.ViewType == 0 || xmDoc.ViewType == 1)) {
    var range   = xmDoc.Range;
    var domNode = range.ContainerNode;
    if (!this.isNodeOrAncestorXInclude(xmDoc, domNode)) {
      xmApp.DisableMacro("__DOCBOOK_SHOW_XINCLUDE__");
      xmApp.DisableMacro("__DOCBOOK_HIDE_XINCLUDE__");
      xmApp.DisableMacro("__DOCBOOK_REFRESH_XINCLUDE__");
      xmApp.DisableMacro("__DOCBOOK_OPEN_XINCLUDE_TARGET__");
    }
      
      
    // Adjust Caption and OnAction for View.Hide/Show XIncludes menu item
    //
    var xiShowingProp = xmDoc.CustomDocumentProperties.Item(this.fXIncludeShowingPropKey);
    if (xiShowingProp) {
      this.adjustShowHideAllXIncludesMenuItem((xiShowingProp.Value == "true") ? true : false);
    }


    // Adjust toggling items...
    //
	if (range.ContainerName == "emphasis") {
		if (range.ContainerAttribute("role") == "bold")
			xmApp.PushInMacro("Toggle_Bold")
		if (range.ContainerAttribute("role") == "italic")
			xmApp.PushInMacro("Toggle_Italic")
		if (range.ContainerAttribute("role") == "underline")
			xmApp.PushInMacro("Toggle_Underline")
		if (range.ContainerAttribute("role") == "tt")
			xmApp.PushInMacro("Toggle_Teletype")
	}

	if (range.ContainerName == "superscript")
		xmApp.PushInMacro("Toggle_Superscript");
	if (range.ContainerName == "subscript")
		xmApp.PushInMacro("Toggle_Subscript");

	if (this.fIndexMarkersOn)
		xmApp.PushInMacro("__DOCBOOK_TOGGLE_INDEXMARKER_VISIBILITY__");

    xmApp.PushInMacro("__DOCBOOK_CSS_EXAMPLE" + this.fBaseCssToAppendIndex + "__");

  // Else, no document open or wrong view-mode...disable DocBook specific macros
  //
  } else {
    xmApp.DisableMacro("__DOCBOOK_SHOW_XINCLUDE__");
    xmApp.DisableMacro("__DOCBOOK_HIDE_XINCLUDE__");
    xmApp.DisableMacro("__DOCBOOK_REFRESH_XINCLUDE__");
    xmApp.DisableMacro("__DOCBOOK_REFRESH_ALL_XINCLUDES__");
    xmApp.DisableMacro("__DOCBOOK_OPEN_XINCLUDE_TARGET__");

	xmApp.DisableMacro("Toggle_Bold")
	xmApp.DisableMacro("Toggle_Italic")
	xmApp.DisableMacro("Toggle_Underline")
	xmApp.DisableMacro("Toggle_Teletype")
  }
}
//========================================================================
// XINCLUDE & XREF HELPERS
//========================================================================
DocBookHandler.prototype.isNodeOrAncestorXInclude = function(xmDoc, domNode)
{
  if (!xmDoc || !domNode)
    return false;
  
  do {
    if (xmDoc.IsXIncludeNode(domNode)) {
      return true;
    }
    domNode = domNode.parentNode;
  } while (domNode != null && domNode.nodeName != ".DOCUMENT");
   
  return false;
}  
//========================================================================
DocBookHandler.prototype.getNearestXIncludeNode = function(xmDoc, domNode)
{
  if (!xmDoc || !domNode)
    return null;

  do {
    if (xmDoc.IsXIncludeNode(domNode)) {
      return domNode;
    }
    domNode = domNode.parentNode;
  } while (domNode != null && domNode.nodeName != ".DOCUMENT");
   
  return null;
}  
//========================================================================
DocBookHandler.prototype.showOrHideXInclude = function(xmDoc, range, show)
{
  if (!xmDoc || !range)
    return;

  var domNode = this.getNearestXIncludeNode(xmDoc, range.ContainerNode);
  if (domNode) {
    if (show) {
      xmDoc.ShowXInclude(domNode);
    } else {
      xmDoc.HideXInclude(domNode);
    }
  }
}  
//========================================================================
DocBookHandler.prototype.showOrHideAllXIncludes = function(xmApp, xmDoc, show)
{
  if (!xmDoc)
    return;

  // Help user to get xincludes showing first time by running update...
  if (show && !this.fDidUpdateXIncludeOnce) {
    xmDoc.UpdateXInclude(xmDoc.documentElement);
    this.showXIncludeLogIfErrors(xmApp, xmDoc);
    this.fDidUpdateXIncludeOnce = true;
  }

  if (show) {
    xmDoc.ShowXInclude(xmDoc.documentElement);
  } else {
    xmDoc.HideXInclude(xmDoc.documentElement);
  }
  
  var xiShowingProp = xmDoc.CustomDocumentProperties.Item(this.fXIncludeShowingPropKey);
  if (xiShowingProp) {
    xiShowingProp.Value = (show) ? "true" : "false";
  }
}  
//========================================================================
DocBookHandler.prototype.refreshXInclude = function(xmApp, xmDoc, range)
{
  if (!xmDoc || !range)
    return;

  var domNode = this.getNearestXIncludeNode(xmDoc, range.ContainerNode);
  if (domNode) {
    xmDoc.UpdateXInclude(domNode);
    this.showXIncludeLogIfErrors(xmApp, xmDoc);
    xmDoc.ShowXInclude(domNode);
  }
}  
//========================================================================
DocBookHandler.prototype.refreshAllXIncludes = function(xmApp, xmDoc)
{
  if (!xmDoc)
    return;

  this.fDidUpdateXIncludeOnce = true; // Flag that xincludes were load at least once
  
  xmDoc.UpdateXInclude(xmDoc.documentElement);
  this.showXIncludeLogIfErrors(xmApp, xmDoc);
  xmDoc.ShowXInclude(xmDoc.documentElement);
  
  var xiShowingProp = xmDoc.CustomDocumentProperties.Item(this.fXIncludeShowingPropKey);
  if (xiShowingProp) {
    xiShowingProp.Value = "true"; // Forces XInclude to "showing"...View menu item will be updated
  }
}  
//========================================================================
DocBookHandler.prototype.openXIncludeTarget = function(xmDoc, range)
{
  if (!xmDoc || !range)
    return;

  var domNode = this.getNearestXIncludeNode(xmDoc, range.ContainerNode);
  if (domNode) {
    xmDoc.OpenXIncludeTarget(domNode);
  }
}
//========================================================================
DocBookHandler.prototype.jumpToLinkEndTarget = function(xmApp, xmDoc, range)
{
  if (!xmApp || !xmDoc || !range)
    return;

  var linkEndNode = range.ContainerNode;
  if (!XM.String.hasContentEx(linkEndNode.getAttribute(this.fLinkEndAttrName)))
    return;
    
  var linkend = linkEndNode.getAttribute(this.fLinkEndAttrName);
  var xmlidXPath = "//*[@id='" + linkend +  "']";
  var targetNodes = xmDoc.getNodesByXPath(xmlidXPath);
  if (targetNodes.length == 1) {
    targetNode = targetNodes.item(0);
    range.SelectNodeContents(targetNode);
    range.Collapse(1);
    range.Select();
  } else {
    var msg = DocBook.Strings.eLinkendNotFound.replace("${LINKEND}", linkend);
    xmApp.Alert(msg);
  }
}
//========================================================================
DocBookHandler.prototype.showXIncludeLog = function(xmApp)
{
  if (!xmApp)
    return;

  xmApp.ResultsManager.ShowLinkLogTab();
}
//========================================================================
DocBookHandler.prototype.showXIncludeLogIfErrors = function(xmApp, xmDoc)
{
  if (!xmApp || !xmDoc)
    return;

  if (xmDoc.LinkResolutionErrorList
      && xmDoc.LinkResolutionErrorList.Count > 0) {
    xmApp.ResultsManager.ShowLinkLogTab();
  }
}
//========================================================================
// IMAGES & LINKS HELPERS
//========================================================================
DocBookHandler.prototype.doImageInsert = function()
{
	var rng2 = ActiveDocument.Range;
	rng2.InsertWithTemplate("mediaobject");
	//  rng2.MoveToElement("imageobject");
	//  rng2.MoveToElement("imagedata");
	rng2.SelectContainerContents();
	rng2.Select();
	if (!this.ChooseImage()) {
		rng2.MoveToElement("mediaobject", false);
		rng2.SelectElement();
		rng2.Delete();
		rng2 = null;
		return false;
	}
	return true;
}  
//========================================================================
DocBookHandler.prototype.doInsertImage = function()
{
	var rng = ActiveDocument.Range;

	// Make Insertion point then try to insert image here
	rng.Collapse(sqCollapseStart);

	// Try to insert the image
	if (rng.CanInsert("mediaobject")) {
		rng.Select();
		this.doImageInsert();
		rng = null;
		return;
	}

	// If can't insert image, split the container and see if we can then
	var node = rng.ContainerNode;
	if (node) {
		var elName = node.nodeName;
		if (elName == "para" || elName == "literallayout" || elName == "programlisting") {
			Selection.SplitContainer();
			rng = ActiveDocument.Range;
			var rngSave = rng.Duplicate;
			rng.SelectBeforeContainer();
			if (rng.CanInsert("mediaobject")) {
				rng.Select();
				if (this.doImageInsert()) {
					rng = null;
					rngSave = null;
					return;
				
				} else {
					rngSave.Select();
					Selection.JoinElementToPreceding();
					rng = null;
					rngSave = null;
					return;
				}

			// Join selection back together
			} else {
				Selection.JoinElementToPreceding();
			}
			rngSave = null;
		}
	}

	// If not, try to find a place to insert the image
	if (rng.FindInsertLocation("mediaobject")) {
		rng.Select();
		this.doImageInsert();
		rng = null;
		return;
	}

	// Try looking backwards
	if (rng.FindInsertLocation("mediaobject", false)) {
		rng.Select();
		this.doImageInsert();
		rng = null;
		return;
	}  

    var msg = DocBook.Strings.eInsertLocationNotFoundForElem.replace("${ELEMENT}", "image");
	Application.Alert(msg);
	rng = null;
}
//========================================================================
DocBookHandler.prototype.doInsertInlineImage = function()
{

	if (Selection.CanInsert("inlinemediaobject")) {
		var url = this.myChooseImage();
		if (url) {
			if (!Selection.IsInsertionPoint) {
				Selection.Delete(); // effect is to replace what was selected, if anything
			}
			Selection.InsertWithTemplate("inlinemediaobject");
			//			Application.Alert(Selection.ContainerName);
			Selection.ContainerAttribute("fileref") = url;

			return true;
			
		} else {
			return false;
		}
		
		return true;
	
	} else {
		var msg = DocBook.Strings.eInsertLocationNotFoundForElem.replace("${ELEMENT}", "inlineimage");
		Application.Alert(msg);
	}
}
//========================================================================
DocBookHandler.prototype.doFigureInsert = function()
{
	var rng2 = ActiveDocument.Range;
	rng2.InsertWithTemplate("figure");
	rng2.MoveToElement("imageobject");
	rng2.MoveToElement("imagedata");
	rng2.SelectContainerContents();
	rng2.Select();
	if (!this.ChooseImage()) {
		rng2.MoveToElement("figure", false);
		rng2.SelectElement();
		rng2.Delete();
		rng2 = null;
		return false;
	}
	rng2.MoveToElement("title", false);
	rng2.SelectContainerContents();
	rng2.Select();
	rng2 = null;
	return true;
}
//========================================================================
DocBookHandler.prototype.doInsertFigure = function()
{
	var rng = ActiveDocument.Range;

	// Make Insertion point then try to insert figure here
	rng.Collapse(sqCollapseStart);

	// Try to insert the figure
	if (rng.CanInsert("figure")) {
		rng.Select();
		this.doFigureInsert();
		rng = null;
		return;
	}

	// If can't insert figure, split the container and see if we can then
	var node = rng.ContainerNode;
	if (node) {
		var elName = node.nodeName;
		if (elName == "para" || elName == "literallayout" || elName == "programlisting") {
			Selection.SplitContainer();
			rng = ActiveDocument.Range;
			var rngSave = rng.Duplicate;
			rng.SelectBeforeContainer();
			if (rng.CanInsert("figure")) {
				rng.Select();
				if (this.doFigureInsert()) {
					rng = null;
					rngSave = null;
					return;
				
				} else {
					rngSave.Select();
					Selection.JoinElementToPreceding();
					rng = null;
					rngSave = null;
					return;
				}

			// Join selection back together
			} else {
				Selection.JoinElementToPreceding();
			}
			rngSave = null;
		}
	}

	// If not, try to find a place to insert the figure
	if (rng.FindInsertLocation("figure")) {
		rng.Select();
		this.doFigureInsert();
		rng = null;
		return;
	}

	// Try looking backwards
	if (rng.FindInsertLocation("figure", false)) {
		rng.Select();
		this.doFigureInsert();
		rng = null;
		return;
	}  

	var msg = DocBook.Strings.eInsertLocationNotFoundForElem.replace("${ELEMENT}", "figure");
	Application.Alert(msg);
	rng = null;
}
//========================================================================
DocBookHandler.prototype.InsertULink = function()
{
	var linkend = Application.Prompt(DocBook.Strings.ulinkPromptMessage, null, null, null, DocBook.Strings.ulinkPromptTitle)
	if (linkend) {
		Selection.InsertElement("uri"/*"ulink"*/)
		Selection.ContainerNode.setAttribute("xlink:href"/*url*/, linkend)
	}
}
//========================================================================
DocBookHandler.prototype.InsertLink = function()
{
	if (Selection.CanInsert("link")) {
		var linkend = Application.Prompt(DocBook.Strings.linkPromptMessage, null, null, null, DocBook.Strings.linkPromptTitle)

		// don't do anything if the user hit CANCEL
		if (linkend) {
			Selection.InsertElement("link")

			// put in something if there was no selection
			if (Selection.IsInsertionPoint) {
				Selection.InsertReplaceableText(DocBook.Strings.linkReplaceableText)
			}
				
			Selection.ContainerNode.setAttribute(this.fLinkEndAttrName, linkend)
		} 
	} else {
		Application.Alert(DocBook.Strings.eInsertLocationNotFound);
	}
}

DocBookHandler.prototype.InsertXRef = function()
{
	if (Selection.CanInsert(this.fCrossRefElemName)) {
		var linkend = Application.Prompt(DocBook.Strings.xrefPromptMessage, null, null, null, DocBook.Strings.xrefPromptTitle)

		// don't do anything if user hit CANCEL
		if (linkend) {
			if (!Selection.IsInsertionPoint) {
				Selection.Collapse(0) // reference goes at end of selection
			}

			Selection.InsertElement(this.fCrossRefElemName)
			Selection.ContainerNode.setAttribute(this.fLinkEndAttrName, linkend)
		}
	} else {
		Application.Alert(DocBook.Strings.eInsertLocationNotFound);
	}
}
//========================================================================
// SECTION HELPERS
//========================================================================
DocBookHandler.prototype.InsertTopLevelSection = function()
{
	this.FindInsertLocation()
	if (Selection.CanInsert(this.getSectionElemName())) {
		Selection.InsertWithTemplate(this.getSectionElemName())
	}
}
//========================================================================
DocBookHandler.prototype.InsertSectionBefore = function()
{
	var myRange = ActiveDocument.Range
	this.FindInsertLocationBefore(myRange)
	if (myRange.CanInsert(this.getSectionElemName())) {
		myRange.InsertWithTemplate(this.getSectionElemName())
		myRange.Select()
	}
}
//========================================================================
DocBookHandler.prototype.InsertSectionAfter = function()
{
	this.FindInsertLocationAfter()
	if (Selection.CanInsert(this.getSectionElemName())) {
		Selection.InsertWithTemplate(this.getSectionElemName())
	}
}
//========================================================================
DocBookHandler.prototype.InsertSubsection = function()
{
	this.FindInsertLocationSubsection()
	if (Selection.CanInsert(this.getSectionElemName())) {
		Selection.InsertWithTemplate(this.getSectionElemName())
	}
}
//========================================================================
DocBookHandler.prototype.JoinSectionToPreceding = function()
{
	var current_range = this.AncestorContentRange(Selection, this.getSectionElemName())
	if (current_range) {
		current_node = current_range.ContainerNode // get node rather than selection
		previous = this.FindPreviousSibling(this.getSectionElemName(), current_node)	
		if (previous) {
			ActiveDocument.RulesChecking = false
			this.RemoveChildren(current_node, "sectioninfo")
			this.RemoveChildren(current_node, "title")
			this.RemoveChildren(current_node, "subtitle")
			this.RemoveChildren(current_node, "titleabbrev")
			ActiveDocument.RulesChecking = true
			current_range.JoinElementToPreceding()
			
		} else {
			Application.Alert(DocBook.Strings.eNoSectionToJoin)
		}
	}
}
//========================================================================
DocBookHandler.prototype.MoveSectionDown = function()
{
	var section = this.AncestorContentRange(Selection, this.getSectionElemName())	// find the current section (in case I'm in a para or title)
	if (section) {
		section = section.ContainerNode		// deal with node not selection
		var sib = this.FindFollowingSibling(this.getSectionElemName(), section)
		if (sib!=null) {
			this.insertAfter(section, sib)
			Selection.SelectNodeContents(section)
			Selection.Collapse(sqCollapseStart)
			
		} else if(section.parentNode.nodeName==this.getSectionElemName()) {
			test = Application.NoticeBox(DocBook.Strings.moveDownNoticeToPromoteMessage, DocBook.Strings.moveDownNoticeToPromoteOKButton, null, null, DocBook.Strings.moveDownNoticeToPromoteTitle)
			if (test==1) {
				Application.Run("Promote_Section")
			}
			
		} else {
			Application.Alert(DocBook.Strings.eCannotMoveSectionDownFurther)
		}
	}
}
//========================================================================
DocBookHandler.prototype.MoveSectionUp = function()
{
	var orig_node = Selection.ContainerNode
	var section = this.AncestorContentRange(Selection, this.getSectionElemName())	// find the current section (in case I'm in a para or title)
	if (section) {
		section = section.ContainerNode		// deal with node not selection
		var sib = this.FindPreviousSibling(this.getSectionElemName(), section)
		if (sib!=null) {
			sib.parentNode.insertBefore(section, sib)
			Selection.SelectNodeContents(orig_node)
			Selection.Collapse(sqCollapseStart)

		} else if(section.parentNode.tagName == this.getSectionElemName()) {
			test = Application.NoticeBox(DocBook.Strings.moveUpNoticeToPromoteMessage, DocBook.Strings.moveUpNoticeToPromoteOKButton, null, null, DocBook.Strings.moveUpNoticeToPromoteTitle)
			if (test==1) {
				this.PromoteSection();
				this.MoveSectionUp()
			}
		}
	}
}
//========================================================================
DocBookHandler.prototype.PromoteSection = function()
{
	var orig_node = Selection.ContainerNode
	var section = this.AncestorContentRange(Selection, this.getSectionElemName())	// find the current section (in case I'm in a para or title)
	if (section) {
		var parent = section.Duplicate				// make a new range object
		parent.SelectAfterContainer()				// get outside of the old section
		parent = this.AncestorContentRange(parent, this.getSectionElemName())		// find another section
		
		if (parent) {
			section = section.ContainerNode			// switch from ranges to nodes
			parent = parent.ContainerNode 
			this.insertAfter(section, parent)
			Selection.SelectNodeContents(orig_node)	// move selection
			Selection.Collapse(sqCollapseStart)
		}
	}
}
//========================================================================
DocBookHandler.prototype.DemoteSection = function()
{
	var current_node = Selection.ContainerNode
	var section = this.AncestorContentRange(Selection, this.getSectionElemName())	// find the current section (in case I'm in a para or title)
	if (section) {
		section = section.ContainerNode		// deal with node not selection
		var sib = this.FindPreviousSibling(this.getSectionElemName(), section)
		if (sib) {
			sib.appendChild(section)
			Selection.SelectNodeContents(current_node)
			Selection.Collapse(sqCollapseEnd)
		}
	}
}
//========================================================================
DocBookHandler.prototype.SplitSection = function()
{
	var old_rules_checking = ActiveDocument.RulesChecking
	if (Selection.IsParentElement("title")) {
		var title = this.AncestorContentRange(Selection, "title")
		title.SelectafterContainer()
		title.Select()
	}

	if (Selection.IsParentElement(this.getSectionElemName())) {
		var section = this.AncestorContentRange(Selection, this.getSectionElemName())	// find the current section (in case I'm in a para or title)
		if (section) {
			ActiveDocument.RulesChecking = false
			section.SplitToElementType(this.getSectionElemName())
			ActiveDocument.RulesChecking = true
			newsection = this.AncestorContentRange(section, this.getSectionElemName())
			if (newsection) {
				newsection.Collapse(sqCollapseStart)
				newsection.InsertWithTemplate("title")
				newsection.Select()
			}
		}
	}
}
//========================================================================
// TOGGLE INLINE HELPERS
//========================================================================
DocBookHandler.prototype.ToggleEmphasis = function(role)
{
	// if not emphasis already, make <emphasis role="italic">
	if (Selection.ContainerName != "emphasis") {
		Selection.InsertElement("emphasis")
		Selection.ContainerAttribute("role") = role

	// if emphasis, then if it's already italic, remove it completely
	} else if (Selection.ContainerAttribute("role") == role) {
		Selection.RemoveContainerTags()

	// otherwise, reset role="italic"	
	} else {
		Selection.ContainerAttribute("role") = role
	}
}
//========================================================================
DocBookHandler.prototype.ToggleScript = function(script)
{
	if (Selection.ContainerName != script)
		Selection.InsertElement(script)
	else
		Selection.RemoveContainerTags()
}
//========================================================================
// META INFO HELPERS
//========================================================================
DocBookHandler.prototype.AddAuthor = function()
{
	var articleinfo = this.getSingletonElement("articleinfo")
	if (articleinfo) {
		Selection.SelectNodeContents(articleinfo)
		Selection.Collapse(1)
		Selection.InsertWithTemplate("author")

	} else {
		// need to insert an <articleinfo> too
		Selection.MoveToDocumentStart()
		if (Selection.FindInsertLocation("articleinfo")) {
			this.TryInsert("articleinfo")
			Selection.InsertWithTemplate("author")
		}
	}
}
//========================================================================
DocBookHandler.prototype.AddBiblioItem = function()
{
	var bibliography = this.getSingletonElement("bibliography")
	if (!bibliography) {
		bibliography = ActiveDocument.documentElement.appendChild(this.createEl("bibliography"))
	}
	if (bibliography) {
		Selection.SelectNodeContents(bibliography)
		Selection.Collapse(0)
		Selection.InsertWithTemplate("bibliomixed")
		Selection.MoveToElement("citetitle")
	}
}
//========================================================================
DocBookHandler.prototype.InsertFootnote = function()
{
	var id = Application.Prompt(DocBook.Strings.footnotePromptForIdMessage, null, null, null, DocBook.Strings.footnotePromptForIdTitle)

	// don't do anything if the user hit CANCEL

	if (id) {
	
		if (!Selection.IsInsertionPoint) {
			Selection.Collapse(0) // footnote goes at the end of current selection
		}
		if (!Selection.CanInsert("footnote")) {
			Application.Alert(DocBook.Strings.eMoveSelectionToInsertFootnote);
			return;
		}
		Selection.InsertElement("footnote")
		var fn = Selection.ContainerNode
		fn.setAttribute(this.fIdAttrName, id)
		var para = this.createEl("para")
		fn.appendChild(para)
		Selection.SelectNodeContents(para)
		var fnref = this.createEl("footnoteref")
		fnref.setAttribute(this.fLinkEndAttrName, id);
		fn.parentNode.insertBefore(fnref, fn)
	}
}
//========================================================================
DocBookHandler.prototype.InsertFootnoteRef = function()
{
	var refid = Application.Prompt(DocBook.Strings.fnrefPromptForIdMessage, null, null, null, DocBook.Strings.fnrefPromptForIdTitle)
	if (refid) {
		if(!Selection.IsInsertionPoint){
			Selection.Collapse(0) // MAG: footnote goes at end of selection
		}
		if (!Selection.CanInsert("footnoteref")) {
			Application.Alert(DocBook.Strings.eMoveSelectionToInsertFootnote);
			return;
		}
		Selection.InsertElement("footnoteref")
//		Selection.MoveToElement("footnoteref")
		Selection.ContainerNode.setAttribute(this.fLinkEndAttrName, refid)
	}
}
//========================================================================
DocBookHandler.prototype.AddKeyword = function(keyword)
{
	var keywordset = this.getSingletonElement("keywordset")
	if(!keywordset){
		var articleinfo = this.getSingletonElement("articleinfo")
		if(articleinfo){
			keywordset = articleinfo.appendChild(this.createEl("keywordset"))
		}
	}
	if(keywordset){
		var text = ActiveDocument.createTextNode(keyword)
		var kw = this.createEl("keyword")
		kw.appendChild(text)
		keywordset.appendChild(kw)
	}
}
//========================================================================
DocBookHandler.prototype.doAddKeyword = function()
{
	keyword = Application.Prompt(DocBook.Strings.keywordPromptForNewMessage)
	if (keyword)
		this.AddKeyword(keyword)
}
//========================================================================
// MISC HELPERS
//========================================================================
DocBookHandler.prototype.isInGraphicalView = function()
{
    // All DocBook custom macros require Tags On or Normal view-mode
    if (!(Application.ActiveDocument
          && (ActiveDocument.ViewType == 0 || ActiveDocument.ViewType == 1))) {
        return false;
    }

    // Fake out Read-Only Documents like they are in non-graphical view to
    // Stop operations that typically execute in graphical view mode.  This 
    // New test is for CMS view documents.
    var rng = ActiveDocument.Range;
    rng.SelectAll();
    if (rng.ReadOnly) {
        return false;
    }
         
    return true;
}
//========================================================================
DocBookHandler.prototype.isInGraphicalViewWithMsg = function()
{
    // All DocBook custom macros require Tags On or Normal view-mode
    if (!this.isInGraphicalView()) {
        Application.Alert(DocBook.Strings.eSwitchToGraphicalView);
        return false;
    }
         
    return true;
}
//========================================================================
DocBookHandler.prototype.getXacBaseName = function(xmDoc)
{
	var macroFN = xmDoc.MacroFile;
	var slash   = macroFN.lastIndexOf("\\");
	var dot     = macroFN.lastIndexOf(".");
	var xacName = macroFN.substring(slash+1, dot);
	return xacName;
}
//========================================================================
DocBookHandler.prototype.myChooseImage = function()
{
    var rng = ActiveDocument.Range;
    try {
      var obj = new ActiveXObject("SQExtras.FileDlg");
    } catch(exception) {
      Application.Alert(DocBook.Strings.ePleaseCheckOrRepairInstall + "SQExtras.dll");
      return null;
    }
    if (obj.DisplayImageFileDlg(true, DocBook.Strings.chooseImageDlgTitle, DocBook.Strings.chooseImageDlgFilter, Application.LastOpenImagePath)) {
      var src = obj.FullPathName;
      var base = ActiveDocument.Path;
      if (base.length > 0)
        base += "\\";
      var url = Application.PathToURL(src, base);
//      rng.ContainerAttribute("fileref") = url;
      return url;
      obj = null;
      rng = null;
      return url;
    }
    else {
//      rng = null;
      obj = null;
      return null;
    }
}
//========================================================================
DocBookHandler.prototype.FindInsertLocation = function()
{
	var nd = Selection.ContainerNode
	while (Selection.ContainerName!=this.getRootElemName() && Selection.ContainerName!=".DOCUMENT") {
		  Selection.SelectElement()
	}
	if (Selection.FindInsertLocation(this.getSectionElemName(),1)) {
		return
	} else if(Selection.FindInsertLocation(this.getSectionElemName(),0)) {
		return
	} else {
		Application.Alert(DocBook.Strings.eInsertLocationNotFound)
	}
}
//========================================================================
DocBookHandler.prototype.FindInsertLocationBefore = function(myRange){
	
	while (myRange.ContainerName!=this.getSectionElemName() && myRange.ContainerNode) {
		myRange.SelectElement()
	}

	if (!myRange.ContainerNode) {
		Application.Alert(DocBook.Strings.eInsertLocationNotFound)
		return
	}

	if (myRange.FindInsertLocation(this.getSectionElemName(),0)) {
		return
	} else if(myRange.FindInsertLocation(this.getSectionElemName(),1)) {
		myRange.Select();
	} else {
		Application.Alert(DocBook.Strings.eInsertLocationNotFound)
	}
}
//========================================================================
DocBookHandler.prototype.FindInsertLocationAfter = function()
{
	while(Selection.ContainerName!=this.getSectionElemName() && Selection.ContainerNode) {
		Selection.SelectElement()
	}

	if (!Selection.ContainerNode) {
		return
	}

	Selection.SelectElement()
	if (Selection.FindInsertLocation(this.getSectionElemName(),1)) {
		return
	} else if (Selection.FindInsertLocation(this.getSectionElemName(),0)){
		return
	} else {
		Application.Alert(DocBook.Strings.eInsertLocationNotFound)
	}
}
//========================================================================
DocBookHandler.prototype.FindInsertLocationSubsection = function()
{
	if (Selection.FindInsertLocation(this.getSectionElemName(),1)) {
		return
	} else if (Selection.FindInsertLocation(this.getSectionElemName(),0)) {
		return
	} else {
		Application.Alert(DocBook.Strings.eInsertLocationNotFound)
	}
}
//========================================================================
DocBookHandler.prototype.FindPreviousSibling = function(eltype, node)
{
	var sib = node.previousSibling
	while (sib!=null && sib.nodeName!=eltype) {
		sib = sib.previousSibling
	}
	return sib	
}
//========================================================================
DocBookHandler.prototype.FindFollowingSibling = function(eltype, node)
{
	var sib = node.nextSibling
	while (sib!=null && sib.nodeName!=eltype) {
		sib = sib.nextSibling
	}
	return sib	
}
//========================================================================
DocBookHandler.prototype.TryInsert = function(elname)
{
	this.FindLocation(elname)
	if (Selection.CanInsert(elname)) {
		Selection.InsertWithTemplate(elname)
	}
	elname = null
}
//========================================================================
DocBookHandler.prototype.AncestorContentRange = function(orig_range, elname)
{
	var range = orig_range.Duplicate // don't destroy original!
	while (range.ContainerNode) {
		if(range.ContainerName==elname){
			return range;
		}
		range.SelectElement()
	}
	return null
}
//========================================================================
DocBookHandler.prototype.FindLocation = function(elname)
{
	var range = Selection.Duplicate
	
	while (range.ContainerNode && !range.CanInsert(elname)) {
		range.SelectElement()
		range.Collapse(0)
	}
	if (range.CanInsert(elname)) {
		range.Select()
	}
	range = null
}
//========================================================================
DocBookHandler.prototype.ChooseImage = function()
{
	var rng = ActiveDocument.Range;
	if (rng.ContainerName == "imagedata") {
		try {
			var obj = new ActiveXObject("SQExtras.FileDlg");
		} catch(exception) {
			Application.Alert(DocBook.Strings.ePleaseCheckOrRepairInstall + "SQExtras.dll");
			return false;
		}
		if (obj.DisplayImageFileDlg(true, DocBook.Strings.chooseImageDlgTitle, DocBook.Strings.chooseImageDlgFilter, Application.LastOpenImagePath)) {
			var src = obj.FullPathName;
			var base = ActiveDocument.Path;
			if (base.length > 0)
				base += "\\";
			var url = Application.PathToURL(src, base);
			rng.ContainerAttribute("fileref") = url;
			obj = null;
			rng = null;
			return true;
		
		} else {
			rng = null;
			obj = null;
			return false;
		}
	
	} else {
		Application.Alert(DocBook.Strings.eGraphicNotSelected);
		rng = null;
		return false;
	}
	rng = null;
}
//========================================================================
DocBookHandler.prototype.createEl = function(name)
{
	return ActiveDocument.createElement(name)
}
//========================================================================
DocBookHandler.prototype.getSingletonElement = function(name)
{
	var lst = ActiveDocument.getElementsByTagName(name)
	if (lst.length > 0) {
		return lst.item(0)
	} else {
		return null
	}
}
//========================================================================
DocBookHandler.prototype.insertAfter = function(node, refnode)
{
	var sib = refnode.nextSibling
	if (sib) {
		refnode.parentNode.insertBefore(node, sib)
	} else {
		refnode.parentNode.appendChild(node)
	}
}
//========================================================================
DocBookHandler.prototype.RemoveChildren = function(node, child_type)
{
	children = node.getElementsByTagName(child_type)
	for (i = 0; i<children.length; i++) {
		child = children.item(i)
		if (child.parentNode==node) {
			node.removeChild(child)
		}
	}
}
//========================================================================
DocBookHandler.prototype.doAboutDocBookSample = function()
{
	var title   = DocBook.Strings.aboutDocBookDlgTitle;
	var version = "Version: 1.0.0";
	var eula    = Application.FileToString(Application.Path + "\\Rules\\DocBook\\eula.txt");

	var xmMsgService = getXMAppService().MessageService;  // XMDK/XMAppService.js
	if (xmMsgService) {
		xmMsgService.ShowAboutBox(title, version, eula);
	}
}
//========================================================================


//========================================================================
// DOCBOOKNAMESPACE CLASS:
//========================================================================
function DocBookNamespace()
{
	this.Strings = new Object;
}
//========================================================================
DocBookNamespace.prototype.Init = function()
{
	this.InitStrings();
}
//========================================================================
DocBookNamespace.prototype.InitStrings = function()
{
	// Errors alerts
	this.Strings.eMakingToolbarsAndMenus        = "Error making DocBook menu and toolbar items = ";
	this.Strings.eLinkendNotFound               = "Linkend, \"${LINKEND}\", not found.";
	this.Strings.eInsertLocationNotFoundForElem = "Could not find insert location for ${ELEMENT}.";
	this.Strings.eInsertLocationNotFound        = "Could not find insert location.";
	this.Strings.eMoveSelectionToInsertFootnote = "Please move selection to where footnote is permitted.";
	this.Strings.eSwitchToGraphicalView         = "Please switch to Tags On or Normal view in order to use the DocBook actions.";
	this.Strings.eCannotMoveSectionUpFurther    = "Nowhere further up to move section.";
	this.Strings.eCannotMoveSectionDownFurther  = "Nowhere further down to move section.";
	this.Strings.eNoSectionToJoin               = "No neighboring section to join.";
	this.Strings.ePleaseCheckOrRepairInstall    = "Please check or repair installation.  File is missing or not registered: ";
	this.Strings.eGraphicNotSelected            = "Graphic not selected.";
	// Prompts, MessageBox and NoticeBox
	this.Strings.ulinkPromptTitle                = "Create hyperlink";
	this.Strings.ulinkPromptMessage              = "Web address";
	this.Strings.linkPromptTitle                 = "Make internal link";
	this.Strings.linkPromptMessage               = "ID of element to link to";
	this.Strings.linkReplaceableText             = "Link text";
	this.Strings.xrefPromptTitle                 = "Make Cross-reference";
	this.Strings.xrefPromptMessage               = "ID of element to cross-reference to";
	this.Strings.moveDownNoticeToPromoteTitle    = "Cannot move down";
	this.Strings.moveDownNoticeToPromoteMessage  = "Cannot move subsection down further within parent section. Perhaps you wish to promote the subsection?";
	this.Strings.moveDownNoticeToPromoteOKButton = "Promote";
	this.Strings.moveUpNoticeToPromoteTitle      = "Cannot move up";
	this.Strings.moveUpNoticeToPromoteMessage    = "Cannot move subsection further up within parent section. Perhaps you wish to promote the subsection?";
	this.Strings.moveUpNoticeToPromoteOKButton   = "Promote";
	this.Strings.footnotePromptForIdTitle        = "Create Footnote";
	this.Strings.footnotePromptForIdMessage      = "Unique footnote Identifier?";
	this.Strings.fnrefPromptForIdTitle           = "Create Footnote Reference";
	this.Strings.fnrefPromptForIdMessage         = "ID of Footnote";
	this.Strings.keywordPromptForNewMessage      = "New Keyword";
	this.Strings.chooseImageDlgTitle             = "Choose Image";
	this.Strings.chooseImageDlgFilter            = FilterStrings[Filters.Image] + "|" + FilterStrings[Filters.All] + "||";
	this.Strings.aboutDocBookDlgTitle            = "XMetaL Author DocBook Sample";
	this.Strings.previewForDocBookUpdating       = "Updating DocBook Display directory...";
	// XInclude menu items
	this.Strings.cbccRefreshShowAllXIncludesWithShortcut = "Refresh and Show All XML Inclusions\tF5";
	this.Strings.cbcdRefreshShowAllXIncludesWithShortcut = "Reload all XML inclusions inline";
	this.Strings.cbccShowAllXIncludes                    = "Show XML Inclusions";
	this.Strings.cbcdShowAllXIncludes                    = "Expand all XML inclusions inline";
	this.Strings.cbccHideAllXIncludes                    = "Hide XML Inclusions";
	this.Strings.cbcdHideAllXIncludes                    = "Hide all XML inclusion expansions";
	this.Strings.cbccShowXIncludeLog                     = "XML Inclusion Log";
	this.Strings.cbcdShowXIncludeLog                     = "Show log of all XML inclusion processing warnings and errors from last update";
	// Right-click menu items
	this.Strings.cbccShowXIncludeWithAccel               = "&Show XML Inclusion";
	this.Strings.cbcdShowXIncludeWithAccel               = "Show XML inclusion inline";
	this.Strings.cbccHideXIncludeWithAccel               = "&Hide XML Inclusion";
	this.Strings.cbcdHideXIncludeWithAccel               = "Hide XML inclusion and show xi:fallback";
	this.Strings.cbccRefreshAndShowXIncludeWithAccel     = "&Refresh and Show XML Inclusion";
	this.Strings.cbcdRefreshAndShowXIncludeWithAccel     = "Reload XML inclusion inline";
	this.Strings.cbccOpenXIncludeTargetWithAccel         = "&Open XML Inclusion Target";
	this.Strings.cbcdOpenXIncludeTargetWithAccel         = "Open XML inclusion target document for editing";
	this.Strings.cbccJumpToLinkendWithAccel              = "&Jump to Linkend";
	this.Strings.cbcdJumpToLinkendWithAccel              = "Move selection to target node with xml:id of xref linkend";
	// Formatting toolbar
	this.Strings.cbFormatting          = "Formatting";
	this.Strings.cbcdToggleBold        = "Bold";
	this.Strings.cbctToggleBold        = "Bold (Ctrl+B)";
	this.Strings.cbcdToggleItalic      = "Italic";
	this.Strings.cbctToggleItalic      = "Italic (Ctrl+I)";
	this.Strings.cbcdToggleUnderline   = "Underline";
	this.Strings.cbctToggleUnderline   = "Underline (Ctrl+U)";
	this.Strings.cbctToggleTeletype    = "Teletype";
	this.Strings.cbctToggleSuperscript = "Superscript";
	this.Strings.cbctToggleSubscript   = "Subscript";
	// DocBook menu
	this.Strings.cbccDocBookMenuButton    = "&DocBook";
	// Common submenu
	this.Strings.cbccCommonSubMenu        = "Common";
	this.Strings.cbccInsertNote           = "Insert Note";
	this.Strings.cbcdInsertNote           = "Insert Note";
	this.Strings.cbccInsertBlockQuote     = "Insert Block Quote";
	this.Strings.cbcdInsertBlockQuote     = "Insert Block Quote";
	this.Strings.cbccInsertExample        = "Insert Example";
	this.Strings.cbcdInsertExample        = "Insert Example";
	this.Strings.cbccInsertLiteralLayout  = "Insert Literal Layout";
	this.Strings.cbcdInsertLiteralLayout  = "Insert Literal Layout";
	this.Strings.cbccInsertProgramListing = "Insert Program Listing";
	this.Strings.cbcdInsertProgramListing = "Insert Program Listing";
	// Sections submenu
	this.Strings.cbccSectionsSubMenu         = "Sections";
	this.Strings.cbccInsertTopLevelSection   = "Insert Top-level Section";
	this.Strings.cbcdInsertTopLevelSection   = "Insert Top-level Section";
	this.Strings.cbccInsertSectionBefore     = "Insert Section Before";
	this.Strings.cbcdInsertSectionBefore     = "Insert Section Before";
	this.Strings.cbccInsertSectionAfter      = "Insert Section After";
	this.Strings.cbcdInsertSectionAfter      = "Insert Section After";
	this.Strings.cbccInsertSubSection        = "Insert Subsection";
	this.Strings.cbcdInsertSubSection        = "Insert Subsection";
	this.Strings.cbccJoinSectionToPrevious   = "Join to Previous Section";
	this.Strings.cbcdJoinSectionToPrevious   = "Join to Previous Section";
	this.Strings.cbccMoveSectionDown         = "Move Section Down";
	this.Strings.cbcdMoveSectionDown         = "Move Section Down";
	this.Strings.cbccMoveSectionUp           = "Move Section Up";
	this.Strings.cbcdMoveSectionUp           = "Move Section Up";
	this.Strings.cbccPromoteSection          = "Promote Section";
	this.Strings.cbcdPromoteSection          = "Promote Section";
	this.Strings.cbccDemoteSection           = "Demote Section";
	this.Strings.cbcdDemoteSection           = "Demote Section";
	this.Strings.cbccSplitSection            = "Split Section";
	this.Strings.cbcdSplitSection            = "Split Section";
	// Toggling submenu
	this.Strings.cbccTogglingSubMenu              = "Toggling";
	this.Strings.cbccToggleBoldWithShortcut       = "Toggle Bold\tCtrl+B";
	this.Strings.cbcdToggleBoldWithShortcut       = "Toggle Bold";
	this.Strings.cbccToggleItalicWithShortcut     = "Toggle Italic\tCtrl+I";
	this.Strings.cbcdToggleItalicWithShortcut     = "Toggle Italic";
	this.Strings.cbccToggleUnderlineWithShortcut  = "Toggle Underline\tCtrl+U";
	this.Strings.cbcdToggleUnderlineWithShortcut  = "Toggle Underline";
	this.Strings.cbccToggleTeletype               = "Toggle Teletype";
	this.Strings.cbcdToggleTeletype               = "Toggle Teletype";
	this.Strings.cbccToggleSuperscript            = "Toggle Superscript";
	this.Strings.cbcdToggleSuperscript            = "Toggle Superscript";
	this.Strings.cbccToggleSubscript              = "Toggle Subscript";
	this.Strings.cbcdToggleSubscript              = "Toggle Subscript";
	// Images and Links submenu
	this.Strings.cbccImagesAndLinksSubMenu        = "Images and Links";
	this.Strings.cbccInsertImage                  = "Insert Image...";
	this.Strings.cbcdInsertImage                  = "Insert Image";
	this.Strings.cbccInsertInlineImage            = "Insert Inline Image...";
	this.Strings.cbcdInsertInlineImage            = "Insert InlineImage";
	this.Strings.cbccInsertFigure                 = "Insert Figure";
	this.Strings.cbcdInsertFigure                 = "Insert Figure";
	this.Strings.cbccInsertULink                  = "Insert ULink";
	this.Strings.cbcdInsertULink                  = "Insert ULink";
	this.Strings.cbccInsertLink                   = "Insert Link";
	this.Strings.cbcdInsertLink                   = "Insert Link";
	this.Strings.cbccInsertXRef                   = "Insert Cross Reference";
	this.Strings.cbcdInsertXRef                   = "Insert Cross Reference";
	// Miscellaneous submenu
	this.Strings.cbccMiscellaneousSubMenu         = "Miscellaneous";
	this.Strings.cbccInsertAuthor                 = "Insert Author";
	this.Strings.cbcdInsertAuthor                 = "Insert Author";
	this.Strings.cbccInsertBiblioItem             = "Insert Bibliography Item";
	this.Strings.cbcdInsertBiblioItem             = "Insert Bibliography Item";
	this.Strings.cbccInsertFootnote               = "Insert Footnote";
	this.Strings.cbcdInsertFootnote               = "Insert Footnote";
	this.Strings.cbccInsertFootnoteRef            = "Insert Footnote Reference";
	this.Strings.cbcdInsertFootnoteRef            = "Insert Footnote Reference";
	this.Strings.cbccInsertKeyword                = "Insert Keyword";
	this.Strings.cbcdInsertKeyword                = "Insert Keyword";
	// Document Display submenu
	this.Strings.cbccDocumentDisplaySubMenu       = "Document Display";
	this.Strings.cbccShowIndexTermsAndFN          = "Display Index Terms and Footnotes";
	this.Strings.cbcdShowIndexTermsAndFN          = "Demostrate On_View_RefreshCssStyles event and relate APIs";
	this.Strings.cbccSwitchToCssExample1          = "Use Stylesheet Example 1";
	this.Strings.cbcdSwitchToCssExample1          = "Demostrate On_View_RefreshCssStyles event and relate APIs";
	this.Strings.cbccSwitchToCssExample2          = "Use Stylesheet Example 2";
	this.Strings.cbcdSwitchToCssExample2          = "Demostrate On_View_RefreshCssStyles event and relate APIs";
	this.Strings.cbccSwitchToCssExample3          = "Use Stylesheet Example 3";
	this.Strings.cbcdSwitchToCssExample3          = "Demostrate On_View_RefreshCssStyles event and relate APIs";
	// About menu item
	this.Strings.cbccAboutDocBookSample           = "About XMetaL Author DocBook Sample...";
	this.Strings.cbcdAboutDocBookSample           = "About XMetaL Author DocBook Sample";
}
//========================================================================


//========================================================================
// BOOTSTRAP:
//========================================================================
var DocBook = null;
try {
  DocBook = new DocBookNamespace;
  DocBook.Init();
} catch (e) {
  Application.Alert("Unexpected error occured while initializing the DocBook namespace object: " + e.description);
}
//========================================================================
