# automatically generated by the FlatBuffers compiler, do not modify

# namespace: NetEncoding

import flatbuffers
from flatbuffers.compat import import_numpy

np = import_numpy()


class DictEncoded32FBArray(object):
    __slots__ = ["_tab"]

    @classmethod
    def GetRootAs(cls, buf, offset=0):
        n = flatbuffers.encode.Get(flatbuffers.packer.uoffset, buf, offset)
        x = DictEncoded32FBArray()
        x.Init(buf, n + offset)
        return x

    @classmethod
    def GetRootAsDictEncoded32FBArray(cls, buf, offset=0):
        """This method is deprecated. Please switch to GetRootAs."""
        return cls.GetRootAs(buf, offset)

    # DictEncoded32FBArray
    def Init(self, buf, pos):
        self._tab = flatbuffers.table.Table(buf, pos)

    # DictEncoded32FBArray
    def Codes(self, j):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(4))
        if o != 0:
            a = self._tab.Vector(o)
            return self._tab.Get(
                flatbuffers.number_types.Int32Flags, a + flatbuffers.number_types.UOffsetTFlags.py_type(j * 4)
            )
        return 0

    # DictEncoded32FBArray
    def CodesAsNumpy(self):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(4))
        if o != 0:
            return self._tab.GetVectorAsNumpy(flatbuffers.number_types.Int32Flags, o)
        return 0

    # DictEncoded32FBArray
    def CodesLength(self):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(4))
        if o != 0:
            return self._tab.VectorLen(o)
        return 0

    # DictEncoded32FBArray
    def CodesIsNone(self):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(4))
        return o == 0

    # DictEncoded32FBArray
    def Dict(self, j):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(6))
        if o != 0:
            a = self._tab.Vector(o)
            return self._tab.Get(
                flatbuffers.number_types.Uint8Flags, a + flatbuffers.number_types.UOffsetTFlags.py_type(j * 1)
            )
        return 0

    # DictEncoded32FBArray
    def DictAsNumpy(self):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(6))
        if o != 0:
            return self._tab.GetVectorAsNumpy(flatbuffers.number_types.Uint8Flags, o)
        return 0

    # DictEncoded32FBArray
    def DictLength(self):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(6))
        if o != 0:
            return self._tab.VectorLen(o)
        return 0

    # DictEncoded32FBArray
    def DictIsNone(self):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(6))
        return o == 0


def Start(builder):
    builder.StartObject(2)


def DictEncoded32FBArrayStart(builder):
    """This method is deprecated. Please switch to Start."""
    return Start(builder)


def AddCodes(builder, codes):
    builder.PrependUOffsetTRelativeSlot(0, flatbuffers.number_types.UOffsetTFlags.py_type(codes), 0)


def DictEncoded32FBArrayAddCodes(builder, codes):
    """This method is deprecated. Please switch to AddCodes."""
    return AddCodes(builder, codes)


def StartCodesVector(builder, numElems):
    return builder.StartVector(4, numElems, 4)


def DictEncoded32FBArrayStartCodesVector(builder, numElems):
    """This method is deprecated. Please switch to Start."""
    return StartCodesVector(builder, numElems)


def AddDict(builder, dict):
    builder.PrependUOffsetTRelativeSlot(1, flatbuffers.number_types.UOffsetTFlags.py_type(dict), 0)


def DictEncoded32FBArrayAddDict(builder, dict):
    """This method is deprecated. Please switch to AddDict."""
    return AddDict(builder, dict)


def StartDictVector(builder, numElems):
    return builder.StartVector(1, numElems, 1)


def DictEncoded32FBArrayStartDictVector(builder, numElems):
    """This method is deprecated. Please switch to Start."""
    return StartDictVector(builder, numElems)


def End(builder):
    return builder.EndObject()


def DictEncoded32FBArrayEnd(builder):
    """This method is deprecated. Please switch to End."""
    return End(builder)
