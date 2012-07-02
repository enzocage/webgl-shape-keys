import bpy

def getTextureCoords(texture, fIndex, vInFIndex):
    u = texture.data[fIndex].uv[vInFIndex][0]
    v = texture.data[fIndex].uv[vInFIndex][1]
    
    return str(u) + ", " + str(v)



# Main Code 

outputTemplate = """\
{
    "indices"  : %(indices)s,
    "textureCoords" : %(textureCoords)s,
    "relativeKeys" : %(relativeKeys)s,
    "shapeKeys"  : [
        %(shapeKeys)s
    ]
}"""

OUTPUT_DIRECTORY = "/home/anton/Documents/blender_shape_keys/"

scene = bpy.context.scene

for object in bpy.data.objects:
    if object.type == 'MESH' and object.data.shape_keys is not None:
        
        mainTexture = None
        if(len(object.data.uv_textures) > 0):
            mainTexture = object.data.uv_textures.active
        
        
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
        
        
        mesh = object.to_mesh(scene, True, 'RENDER')        

        indices = "[ "
        
        textureCoords = "[ "
        
        firstValue = True
        
        for fIndex, f in enumerate(mesh.faces):
            
            for vIndex, v in enumerate(f.vertices):
                textureCoord = ""
                
                if mainTexture is not None:
                    textureCoord = getTextureCoords(mainTexture, fIndex, vIndex)
                
                if firstValue:
                    indices += str(v)
                    
                    if mainTexture is not None:
                        textureCoords += textureCoord
                        
                    firstValue = False
                else:
                    indices += ", " + str(v)
                    
                    if mainTexture is not None:
                        textureCoords += ", " + textureCoord
            
        indices += " ]"
        
        textureCoords += " ]"
        
            
        shapeKeysText = ""
        
        firstShapeKey = True
        
        for blockIndex, block in enumerate(object.data.shape_keys.key_blocks):
            
            vertices = "[ "
        
            firstValue = True
            
            block.value = 1.0

            mesh = object.to_mesh(scene, True, 'RENDER')
            
            for vertexIndex, v in enumerate(mesh.vertices):
                
                allVertexText = str(round(v.co.x, 6))
                allVertexText += ", " + str(round(v.co.y, 6))
                allVertexText += ", " + str(round(v.co.z, 6))
                allVertexText += ", " + str(round(v.normal.x, 6))
                allVertexText += ", " + str(round(v.normal.y, 6))
                allVertexText += ", " + str(round(v.normal.z, 6))
                
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
            "indices" : indices,
            "textureCoords" : textureCoords,
            "relativeKeys": relativeKeys,
            "shapeKeys" : shapeKeysText
        }
        
        outputText = outputTemplate % parameters
        
        out = open(OUTPUT_DIRECTORY + object.name + ".js", "w")
        out.write(outputText)
        out.close()
