import cv2
import numpy as np
from abc import ABC, abstractclassmethod

class Shape(ABC):
    @abstractclassmethod
    def draw(self, img):
        pass

class Circle(Shape):
    def __init__(self, coordinate, radius, color, thickness):
        self.coordinate = coordinate
        self.radius = radius
        self.color = color
        self.thickness = thickness
        
    def draw(self, img):
        cv2.circle(img, self.coordinate, self.radius, self.color, self.thickness)

class Ellipse(Shape):
    def __init__(self, coordinate, axis_length, angle,
                 start_angle, end_angle, color, thickness):
        self.coordinate = coordinate
        self.axis_length = axis_length
        self.angle = angle
        self.start_angle = start_angle
        self.end_angle = end_angle
        self.color = color
        self.thickness = thickness
        
    def draw(self, img):
        cv2.ellipse(img, self.coordinate, self.axis_length,
                   self.angle, self.start_angle, self.end_angle,
                   self.color, self.thickness)

class Rectangle(Shape):
    def __init__(self, coordinate, color, thickness):
        self.coordinate = coordinate
        self.color = color
        self.thickness = thickness
        
    def draw(self, img):
        cv2.rectangle(img, self.coordinate[0], self.coordinate[1],
                      self.color, self.thickness)

class Triangle(Shape):
    def __init__(self, pts, color, thickness):
        self.pts = np.array(pts, np.int32)
        self.color = color
        self.thickness = thickness

    def draw(self, img):
        if self.thickness != -1:
            cv2.polylines(img, [self.pts], True, self.color, self.thickness)
        else:
            cv2.fillPoly(img, [self.pts], self.color)

class Polygon(Shape):
    def __init__(self, pts, color, thickness):
        self.pts = np.array(pts, np.int32)
        self.color = color
        self.thickness = thickness

    def draw(self, img):
        if self.thickness != -1:
            cv2.polylines(img, [self.pts], True, self.color, self.thickness)
        else:
            cv2.fillPoly(img, [self.pts], self.color)

class Human(Shape):
    def __init__(self, coordinate, color, size, thickness):
        head = Circle(coordinate, size, color, thickness)
        body = Rectangle(((coordinate[0] - size, coordinate[1] + size), (coordinate[0] + size, coordinate[1] + size * 4)),
                            color, thickness)
        arm_left = Rectangle(((coordinate[0] - (size * 3), coordinate[1] + size), (coordinate[0] - size, coordinate[1] + int(size * 1.7))),
                                color, thickness)
        arm_right = Rectangle(((coordinate[0] + size, coordinate[1] + size), (coordinate[0] + (size * 3), coordinate[1] + int(size * 1.7))),
                                color, thickness)
        leg_left = Rectangle(((coordinate[0] - size, coordinate[1] + (size * 4)), (coordinate[0] - int(size / 6), coordinate[1] + (size * 7))),
                                color, thickness)
        leg_right = Rectangle(((coordinate[0] + int(size / 6), coordinate[1] + (size * 4)), (coordinate[0] + size, coordinate[1] + (size * 7))),
                                color, thickness)
        self.all_part = [head, body, arm_left, arm_right, leg_left, leg_right]

    def draw(self, img):
        for part in self.all_part:
            part.draw(img)

class Car(Shape):
    def __init__(self, coordinate, color, size, thickness):
        upper_part = Polygon([coordinate, (coordinate[0] + (size * 2), coordinate[1]), (coordinate[0] + (size * 3), coordinate[1] + (size * 2)),
                             (coordinate[0] - size, coordinate[1] + (size * 2))], color, thickness)
        lower_part = Rectangle(((coordinate[0] - (size * 3), coordinate[1] + (size * 2)), (coordinate[0] + (size * 4), coordinate[1] + (size * 4))),
                                color, thickness)
        wheel_front = Circle((coordinate[0] - size, coordinate[1] + (size * 4) - int(size * 0.2)), size, color, thickness)
        wheel_back = Circle((coordinate[0] + (size * 2), coordinate[1] + (size * 4) - int(size * 0.2)), size, color, thickness)
        self.all_part = [upper_part, lower_part, wheel_front, wheel_back]

    def draw(self, img):
        for part in self.all_part:
            part.draw(img)

class House(Shape):
    def __init__(self, coordinate, color, size, thickness):
        roof = Polygon([coordinate, (coordinate[0] + (size * 2), coordinate[1] + (size * 2)), (coordinate[0] - (size * 2), coordinate[1] + (size * 2))],
                        color, thickness)
        body = Rectangle(((coordinate[0] - int(size * 1.3), coordinate[1] + (size * 2)), (coordinate[0] + int(size * 1.3), coordinate[1] + (size * 4))),
                                color, thickness)
        door = Rectangle(((coordinate[0] + int(size * 0.1), coordinate[1] + (size * 3)), (coordinate[0] + int(size * 0.9), coordinate[1] + (size * 4))),
                                (255, 255, 255), thickness)
        door_knob = Circle((coordinate[0] + int(size * 0.8), coordinate[1] + (size * 4) - int(size * 0.6)), int(size * 0.1), color, thickness)
        self.all_part = [roof, body, door, door_knob]

    def draw(self, img):
        for part in self.all_part:
            part.draw(img)

def main():
    img = np.zeros((768,1024,3), np.uint8)
    img[:][:][:] = 255

    shape = [Circle((100, 100), 50, (255, 102, 102), -1),
             Rectangle(((200, 50), (300, 150)), (255, 178, 102), -1),
             Triangle([[150, 400], [50, 500], [250, 500]], (255, 102, 178), -1), 
             Polygon([[300, 400], [400, 400], [450, 450], [400, 500], [300, 500], [250, 450]], (178, 255, 102), -1),
             Ellipse((256,256), (100,50), 0, 0, 360, (178, 102, 255), -1),
             House((650 ,250), (75, 75, 220), 50, -1),
             Car((700, 500), (40, 165, 220), 30, -1),
             Human((750, 110), (178, 78, 102), 20, -1),
             Human((550, 124), (178, 78, 102), 18, -1)]

    for s in shape:
        s.draw(img)

    cv2.imshow('Drawing', img)
    cv2.waitKey(0) 

if __name__ == '__main__':
    main()
