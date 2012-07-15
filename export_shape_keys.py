import bpy
import os

OUTPUT_DIRECTORY = "***CHANGE THIS!***"
PRECISION = 6

def getTextureCoords(texture, fIndex, vInFIndex):
    u = texture.data[fIndex].uv[vInFIndex][0]
    v = texture.data[fIndex].uv[vInFIndex][1]
    
    return str(round(u, PRECISION)) + "," + str(round(v, PRECISION))

def getTextureCoordsByVertex(mesh, texture, vIndex):
	for fIndex, f in enumerate(mesh.tessfaces):
		for vInFIndex, vIndexValue in enumerate(f.vertices):
			if vIndexValue == vIndex:
				return getTextureCoords(texture, fIndex, vInFIndex)
	return "0.0,0.0";

def vertexToStr(v):
    ret = str(round(v.co.x, PRECISION))
    ret += "," + str(round(v.co.y, PRECISION))
    ret += "," + str(round(v.co.z, PRECISION))
    ret += "," + str(round(v.normal.x, PRECISION))
    ret += "," + str(round(v.normal.y, PRECISION))
    ret += "," + str(round(v.normal.z, PRECISION))
    return ret

def getTextureStrs(mesh):
    #Just assume there one texture file and use the first one we find
    materialIndex = mesh.tessfaces[0].material_index
    filePath = mesh.materials[materialIndex].active_texture.image.filepath
    filePath = bpy.path.abspath(filePath)
    textureFile = '"' + os.path.basename(filePath) + '"'
    
    
    textureCoords = "[ "
    
    firstValue = True
    
    mainTexture = mesh.tessface_uv_textures.active
    
    for fIndex, f in enumerate(mesh.tessfaces):
        allTextureCoords = []
        for vInFIndex, vIndex in enumerate(f.vertices):
            allTextureCoords.append(getTextureCoords(mainTexture, fIndex, vInFIndex))
        
        textureStr = allTextureCoords[0] + "," + allTextureCoords[1] + "," + allTextureCoords[2]
        
        if len(f.vertices) == 4:
            textureStr += "," + allTextureCoords[0] + "," + allTextureCoords[2] + "," + allTextureCoords[3]
        
        if firstValue:
            textureCoords += textureStr
            firstValue = False
        else:
            textureCoords += "," + textureStr
    
    textureCoords += " ]"
    
    
    return textureFile, textureCoords

def getRelativeKeysStr(object):
    shapeKeyNameToIndex = {}

    for blockIndex, block in enumerate(object.data.shape_keys.key_blocks):
        if blockIndex != 0 :
            block.value = 0.0
        shapeKeyNameToIndex[block.name] = blockIndex

    relativeKeys = "[ "
    
    firstValue = True
    
    for block in object.data.shape_keys.key_blocks:
        relativeKey = str(shapeKeyNameToIndex[block.relative_key.name])
        
        if firstValue:
            relativeKeys += relativeKey
            firstValue = False
        else:
            relativeKeys += ", " + relativeKey
    
    relativeKeys += " ]"
    
    return relativeKeys

def getFaceCountAndVertices(mesh, matIndex):
    faceCount = 0
    
    firstValue = True
    
    vertices = "[ "
    
    for fIndex, f in enumerate(mesh.tessfaces):
        if matIndex != -1 and f.material_index != matIndex:
            continue
        
        allVertices = []
        for vInFIndex, vIndex in enumerate(f.vertices):
            v = mesh.vertices[vIndex]
            allVertices.append(vertexToStr(v))
            
        allVertexText = allVertices[0] + "," + allVertices[1] + "," + allVertices[2]
        
        faceCount += 3
        
        if len(f.vertices) == 4:
            allVertexText += "," + allVertices[0] + "," + allVertices[2] + "," + allVertices[3]
            
            faceCount += 3
        
        if firstValue:
            vertices += allVertexText
            firstValue = False
        else:
            vertices += "," + allVertexText
            
    vertices += " ]"
    
    return faceCount, vertices

def getShapeKeysStrs(object, mesh, hasShapeKeys, matIndex=-1):
    faceCount = 0
        
    shapeKeysText = ""
    
    if hasShapeKeys == False:
        mesh = object.to_mesh(scene, True, 'RENDER')
        mesh.transform(object.matrix_world)
        mesh.calc_normals()
        
        faceCount, shapeKeysText = getFaceCountAndVertices(mesh, matIndex)
        
        return faceCount, shapeKeysText
    
    
    firstShapeKey = True
    
    for blockIndex, block in enumerate(object.data.shape_keys.key_blocks):
        
        block.value = 1.0

        mesh = object.to_mesh(scene, True, 'RENDER')
        mesh.transform(object.matrix_world)
        mesh.calc_normals()
        
        faceCount, vertices = getFaceCountAndVertices(mesh, matIndex)

        block.value = 0.0
        
        
        if firstShapeKey:
            shapeKeysText += vertices
            firstShapeKey = False
        else:
            shapeKeysText += ",\n\t\t" + vertices
    
    return faceCount, shapeKeysText

def writeFile(object, faceCount, textureFile, textureCoords, diffuseColor, relativeKeys, shapeKeysText, optStr=""):
    #Generate Final Output Text    
    parameters = {
        "faceCount" : str(faceCount),
        "textureFile" : textureFile,
        "textureCoords" : textureCoords,
        "diffuseColor" : diffuseColor,
        "relativeKeys": relativeKeys,
        "shapeKeys" : shapeKeysText
    }
    
    outputText = outputTemplate % parameters
    
    out = open(OUTPUT_DIRECTORY + object.name + optStr + ".js", "w")
    out.write(outputText)
    out.close()



# Main Code 

outputTemplate = """\
{
    "faceCount" : %(faceCount)s,
    "textureFile" : %(textureFile)s,
    "textureCoords" : %(textureCoords)s,
    "diffuseColor" : %(diffuseColor)s,
    "relativeKeys" : %(relativeKeys)s,
    "shapeKeys"  : [
        %(shapeKeys)s
    ]
}"""

scene = bpy.context.scene

for object in bpy.data.objects:
    if object.type == 'MESH':
        
        hasShapeKeys = object.data.shape_keys is not None
        
        mesh = object.to_mesh(scene, True, 'RENDER')
        mesh.transform(object.matrix_world)
        mesh.calc_normals()
        
        relativeKeys = "[ 0 ]"
        if hasShapeKeys:
            relativeKeys = getRelativeKeysStr(object)
        
        textureFile = "\"\""
        textureCoords = "[ ]"
        
        diffuseColor = "[ ]"
        
        if(len(mesh.tessface_uv_textures) > 0):
            textureFile, textureCoords = getTextureStrs(mesh)
        
            faceCount, shapeKeysText = getShapeKeysStrs(object, mesh, hasShapeKeys)
            
            writeFile(object, faceCount, textureFile, textureCoords, diffuseColor, relativeKeys, shapeKeysText)
        else:
            matIndices = {}
            
            for f in mesh.tessfaces:
                if f.material_index not in matIndices:
                    matIndices[f.material_index] = True
            
            for matIndex in matIndices:
                color = mesh.materials[matIndex].diffuse_color
                intensity = mesh.materials[matIndex].diffuse_intensity
                
                r = str(round(color.r * intensity, 8))
                g = str(round(color.g * intensity, 8))
                b = str(round(color.b * intensity, 8))
                
                diffuseColor = "[ " + r + ", " + g + ", " + b + " ]"
                
                faceCount, shapeKeysText = getShapeKeysStrs(object, mesh, hasShapeKeys, matIndex)
                
                writeFile(object, faceCount, textureFile, textureCoords, diffuseColor, relativeKeys, shapeKeysText, "_"+str(matIndex))
