# Validate the actual LC2 map with the OGC IndoorGML Core schema and the
# consolidated dependency schemas distributed by the OGC conformance suite.
param(
    [string]$GmlPath = (Join-Path $PSScriptRoot '../assets/data/indoorgml/lc2.gml'),
    [string]$SchemaDirectory
)

$ErrorActionPreference = 'Stop'
$suiteRevision = '3c96f33f77d5b4fea774d872b400fad0faead97f'
$bundle = "https://raw.githubusercontent.com/opengeospatial/ets-indoorgml10/$suiteRevision/src/main/resources/org/opengis/cite/indoorgml10/xsd"
$files = [ordered]@{
    'indoorgmlcore.xsd' = 'https://schemas.opengis.net/indoorgml/1.0/indoorgmlcore.xsd'
    'gml-3.2.1.xsd' = "$bundle/opengis/gml/3.2.1/gml-3.2.1.xsd"
    'gco-2007.xsd' = "$bundle/iso/19139/2007/gco-2007.xsd"
    'gmd-2007.xsd' = "$bundle/iso/19139/2007/gmd-2007.xsd"
    'gsr-2007.xsd' = "$bundle/iso/19139/2007/gsr-2007.xsd"
    'gss-2007.xsd' = "$bundle/iso/19139/2007/gss-2007.xsd"
    'gts-2007.xsd' = "$bundle/iso/19139/2007/gts-2007.xsd"
    'xlink.xsd' = "$bundle/opengis/xlink/1.0/xlink-1.0.xsd"
    'xml.xsd' = "$bundle/w3c/2009/01/xml.xsd"
}

$schemas = [System.Xml.Schema.XmlSchemaSet]::new()
$schemas.XmlResolver = $null
foreach ($file in $files.GetEnumerator()) {
    if ($SchemaDirectory) {
        $text = [IO.File]::ReadAllText((Resolve-Path (Join-Path $SchemaDirectory $file.Key)).Path)
    } else {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $file.Value
        $text = $response.Content
        if ($text -is [byte[]]) { $text = [Text.Encoding]::UTF8.GetString($text) }
    }
    $reader = [System.IO.StringReader]::new($text)
    try {
        $schema = [System.Xml.Schema.XmlSchema]::Read($reader, $null)
        $null = $schemas.Add($schema)
    } finally {
        $reader.Dispose()
    }
}
$schemas.Compile()
$settings = [System.Xml.XmlReaderSettings]::new()
$settings.Schemas = $schemas
$settings.ValidationType = [System.Xml.ValidationType]::Schema
$settings.XmlResolver = $null
$path = (Resolve-Path -LiteralPath $GmlPath).Path
$reader = [System.Xml.XmlReader]::Create($path, $settings)
try {
    [void]$reader.MoveToContent()
    if ($reader.LocalName -ne 'IndoorFeatures' -or $reader.NamespaceURI -ne 'http://www.opengis.net/indoorgml/1.0/core') {
        throw 'Expected an IndoorGML 1.0 Core IndoorFeatures document.'
    }
    while ($reader.Read()) {}
} finally {
    $reader.Dispose()
}
Write-Output "Passed IndoorGML 1.0.3 Core XSD validation: $path"
