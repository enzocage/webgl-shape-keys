import bpy

def getTextureCoords(texture, fIndex, vInFIndex):
    u = texture.data[fIndex].uv[vInFIndex][0]
    v = texture.data[fIndex].uv[vInFIndex][1]
    
    return str(u) + ", " + str(v)

def getTextureCoordsByVertex(mesh, texture, vIndex):
	for fIndex, f in enumerate(mesh.tessfaces):
		for vInFIndex, vIndexValue in enumerate(f.vertices):
			if vIndexValue == vIndex:
				return getTextureCoords(texture, fIndex, vInFIndex)
	return "0.0, 0.0";

def vertexToStr(v):
    ret = str(round(v.co.x, 6))
    ret += ", " + str(round(v.co.y, 6))
    ret += ", " + str(round(v.co.z, 6))
    ret += ", " + str(round(v.normal.x, 6))
    ret += ", " + str(round(v.normal.y, 6))
    ret += ", " + str(round(v.normal.z, 6))
    return ret


# Main Code 

outputTemplate = """\
{
    "faceCount" : %(faceCount)s,
    "textureCoords" : %(textureCoords)s,
    "relativeKeys" : %(relativeKeys)s,
    "shapeKeys"  : [
        %(shapeKeys)s
    ]
}"""

OUTPUT_DIRECTORY = "/home/anton/Desktop/"

scene = bpy.context.scene

for object in bpy.data.objects:
    if object.type == 'MESH' and object.data.shape_keys is not None:
        
        mesh = object.to_mesh(scene, True, 'RENDER')    
        
        textureCoords = "[ "
        
        firstValue = True
        
        if(len(mesh.tessface_uv_textures) > 0):
            mainTexture = mesh.tessface_uv_textures.active
            
            for fIndex, f in enumerate(mesh.tessfaces):
                allTextureCoords = []
                for vInFIndex, vIndex in enumerate(f.vertices):
                    allTextureCoords.append(getTextureCoords(mainTexture, fIndex, vInFIndex))
                
                textureStr = allTextureCoords[0] + ", " + allTextureCoords[1] + ", " + allTextureCoords[2]
                
                if len(f.vertices) == 4:
                    textureStr += ", " + allTextureCoords[0] + ", " + allTextureCoords[2] + ", " + allTextureCoords[3]
                
                if firstValue:
                    textureCoords += textureStr
                    firstValue = False
                else:
                    textureCoords += ", " + textureStr
        
        textureCoords += " ]"
        
        
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
        
        
        faceCount = 0
            
        shapeKeysText = ""
        
        firstShapeKey = True
        
        for blockIndex, block in enumerate(object.data.shape_keys.key_blocks):
            
            vertices = "[ "
        
            firstValue = True
            
            block.value = 1.0

            mesh = object.to_mesh(scene, True, 'RENDER')
            
            for fIndex, f in enumerate(mesh.tessfaces):
                allVertices = []
                for vInFIndex, vIndex in enumerate(f.vertices):
                    v = mesh.vertices[vIndex]
                    allVertices.append(vertexToStr(v))
                    
                allVertexText = allVertices[0] + ", " + allVertices[1] + ", " + allVertices[2]
                
                if firstShapeKey:
                    faceCount += 3
                
                if len(f.vertices) == 4:
                    allVertexText += ", " + allVertices[0] + ", " + allVertices[2] + ", " + allVertices[3]
                    
                    if firstShapeKey:
                        faceCount += 3
                
                if firstValue:
                    vertices += allVertexText
                    firstValue = False
                else:
                    vertices += ", " + allVertexText

            block.value = 0.0
        
            vertices += " ]"
            
            if firstShapeKey:
                shapeKeysText += vertices
                firstShapeKey = False
            else:
                shapeKeysText += ",\n\t\t" + vertices
        
                
        
        #Generate Final Output Text    
        parameters = {
            "faceCount" : str(faceCount),
            "textureCoords" : textureCoords,
            "relativeKeys": relativeKeys,
            "shapeKeys" : shapeKeysText
        }
        
        outputText = outputTemplate % parameters
        
        out = open(OUTPUT_DIRECTORY + object.name + ".js", "w")
        out.write(outputText)
        out.close()
