<?xml version="1.0"?>
<!DOCTYPE MACROS SYSTEM "macros.dtd">

<MACROS> 

<!--
     Copyright 2009 Justsystems Canada Inc.
 
     This XMetaL extension is the property of Justsystems Canada Inc.
     and its licensors and is protected by copyright.   Modifications of
     this extension may invalidate any support that you may be entitled to.
     Any reproduction in whole or in part is strictly prohibited. 
-->


<!-- DOCUMENT-LEVEL EVENT HANDLERS -->
<!-- DOCUMENT-LEVEL EVENT HANDLERS -->
<!-- DOCUMENT-LEVEL EVENT HANDLERS -->

<MACRO name="On_Macro_File_Load" lang="JScript" hide="true"><![CDATA[

  //========================================================================
  // INJECT LIBRARIES/CODE:
  //========================================================================
  //eval(Application.FileToString(Application.Path + "\\Rules\\PI-Mod\\PI-Mod-Custom\\DTD\\document-custom.js"));
eval(Application.FileToString("C:\\Temp\\InfoB\\PI-Mod\\PI-Mod-Custom\\DTD\\document-custom.js"));

  //========================================================================
  // CONSTANTS + MESSAGES + GLOBALS:
  //========================================================================
  var __XM_DOCBOOK50XI_OK__ = false;
  var gDocBook50XIHandler   = null;
  //========================================================================


  //========================================================================
  // BOOTSTRAP:
  //========================================================================
  try {
    gDocBook50XIHandler = new DocBookHandler("5.0XI");
    __XM_DOCBOOK50XI_OK__ = true;
  
  } catch (e) {
    gDocBook50XIHandler   = null;
    __XM_DOCBOOK50XI_OK__ = false;
  }
  //========================================================================

]]></MACRO> 


<MACRO name="On_CommandBars_Load_Complete" lang="JScript" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__) {
    gDocBook50XIHandler.OnLocalCommandBarsComplete(Application.CommandBars);
  }
]]></MACRO>


<MACRO name="On_Edit_Attribute_From_AI" lang="JScript" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalView()) {
    var xmDoc = Application.ActiveDocument;
    gDocBook50XIHandler.OnCustomEditAttribute(xmDoc,
                                          xmDoc.EditAttributeNode,
                                          xmDoc.EditAttributeName,
                                          xmDoc.EditAttributeValue);
  }
]]></MACRO>


<MACRO name="On_Context_Menu" lang="JScript" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalView()) {
    gDocBook50XIHandler.OnContextMenu(Application.ActiveContextMenu, Application.ActiveDocument);
  }
]]></MACRO>


<MACRO name="On_Update_UI" lang="JScript" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__) {
    gDocBook50XIHandler.OnUpdateUI(Application, Application.ActiveDocument);
  }
]]></MACRO>

<!-- DOCBOOK XINCLUDE OPERATIONS -->
<!-- DOCBOOK XINCLUDE OPERATIONS -->
<!-- DOCBOOK XINCLUDE OPERATIONS -->

<MACRO name="__DOCBOOK_SHOW_XINCLUDE__" lang="JScript" desc="Show XML inclusion inline" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalViewWithMsg()) {
    gDocBook50XIHandler.showOrHideXInclude(Application.ActiveDocument, Application.ActiveDocument.Range, true);
  }
]]></MACRO>

<MACRO name="__DOCBOOK_SHOW_ALL_XINCLUDES__" lang="JScript" desc="Show all XML inclusions inline" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalViewWithMsg()) {
    gDocBook50XIHandler.showOrHideAllXIncludes(Application, Application.ActiveDocument, true);
  }
]]></MACRO>

<MACRO name="__DOCBOOK_HIDE_XINCLUDE__" lang="JScript" desc="Hide XML inclusion and show xi:fallback" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalViewWithMsg()) {
    gDocBook50XIHandler.showOrHideXInclude(Application.ActiveDocument, Application.ActiveDocument.Range, false);
  }
]]></MACRO>

<MACRO name="__DOCBOOK_HIDE_ALL_XINCLUDES__" lang="JScript" desc="Hide all XML inclusions and show xi:fallback" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalViewWithMsg()) {
    gDocBook50XIHandler.showOrHideAllXIncludes(Application, Application.ActiveDocument, false);
  }
]]></MACRO>

<MACRO name="__DOCBOOK_REFRESH_XINCLUDE__" lang="JScript" desc="Reload XML inclusion inline" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalViewWithMsg()) {
    gDocBook50XIHandler.refreshXInclude(Application, Application.ActiveDocument, Application.ActiveDocument.Range);
  }
]]></MACRO>

<MACRO name="__DOCBOOK_REFRESH_ALL_XINCLUDES__" lang="JScript" desc="Reload all XML inclusions inline" key="F5" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalViewWithMsg()) {
    gDocBook50XIHandler.refreshAllXIncludes(Application, Application.ActiveDocument);
  }
]]></MACRO>

<MACRO name="__DOCBOOK_OPEN_XINCLUDE_TARGET__" lang="JScript" desc="Open XML inclusion target document for editing" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalViewWithMsg()) {
    gDocBook50XIHandler.openXIncludeTarget(Application.ActiveDocument, Application.ActiveDocument.Range);
  }
]]></MACRO>

<MACRO name="__DOCBOOK_JUMPTO_LINKEND__" lang="JScript" desc="Jump to element denoted by xref linkend attribute" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalViewWithMsg()) {
    gDocBook50XIHandler.jumpToLinkEndTarget(Application, Application.ActiveDocument, Application.ActiveDocument.Range);
  }
]]></MACRO>

<MACRO name="__DOCBOOK_SHOW_XML_INCLUSION_LOG__" lang="JScript" desc="Jump to element denoted by xref linkend attribute" hide="true"><![CDATA[
  if (__XM_DOCBOOK50XI_OK__ && gDocBook50XIHandler.isInGraphicalViewWithMsg()) {
    gDocBook50XIHandler.showXIncludeLog(Application);
  }
]]></MACRO>


</MACROS> 
