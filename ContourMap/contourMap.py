import matplotlib.pyplot as plt
import matplotlib.widgets as mpw
import numpy as np
import math

#fig,ax = plt.subplots()
fig = plt.figure()
ax = plt.axes([0.05, 0.2, 0.9, 0.7])
scaleBox = plt.axes([0.2, 0.02, 0.6, 0.0375])
radiusBox = plt.axes([0.2, 0.0575, 0.6, 0.0375])

ax.grid(color='#aaa', linestyle='-', linewidth=1)

ax.set_xlim(0, 10)
ax.set_ylim(0, 10)

cursor, = ax.plot(5,5,'rx')

points = []
lineP = None
areaP = None
areaT = None
firstPoint = None
ppp = None
selected = None

pickedUp = False
pickedPoint = -1

radius = 2

circleArea = (radius**2) * 4

fig.canvas.draw()

def PolyArea(x,y):
    return 0.5*np.abs(np.dot(x,np.roll(y,1))-np.dot(y,np.roll(x,1)))

def update(text):
    ax.set_xlim(0, float(text))
    ax.set_ylim(0, float(text))

def radUpdate(text):
    global radius, circleArea
    radius = float(text)
    circleArea = (radius**2) * 4

    xs, ys = zip(*points)

    areaa = max(math.floor(PolyArea(xs,ys) / circleArea),1)
    areaT.set_text(f'Max Capacity: {areaa}')

    fig.canvas.draw()
    fig.canvas.flush_events()

def onclick(event):

    global lineP, areaP, areaT, cursor, pickedUp, pickedPoint, ppp, firstPoint, selected

    if(event.y >= 150):

        if (pickedUp):
            pickedUp = False
            pickedPoint = -1
            selected.set_xdata(-1)
            selected.set_ydata(-1)

        elif(str(event.button) == "MouseButton.RIGHT"):
            if( not pickedUp):
                for i in range(0,len(points)):
                    curPoint = points[i]
                    distance = math.sqrt( ((curPoint[0]-event.xdata)**2)+((curPoint[1]-event.ydata)**2) )
                    if(distance < (abs(ax.get_xlim()[0]) + abs(ax.get_xlim()[1])) / 20):
                        pickedUp = True
                        pickedPoint = i
                        selected.set_xdata(curPoint[0])
                        selected.set_ydata(curPoint[1])
                        print(i)
                        break;

        else:
            print(event.button)

            points.insert(len(points) - 1,[event.xdata,event.ydata])

            if (len(points) == 1):
                points.append([event.xdata,event.ydata])
                xs, ys = zip(*points)

                lineP, = ax.plot(xs,ys)
                areaP, = ax.fill(xs,ys, facecolor='#ccc')

                areaa = PolyArea(xs,ys)

                ppp, = ax.plot(xs,ys,'bo')

                #print(PolyArea(xs,ys))

                areaT = ax.text(0.5, 0.96, 'Area' + str(areaa), horizontalalignment='center', verticalalignment='center', transform=ax.transAxes)

                firstPoint, = ax.plot(points[0][0],points[0][1],'ro')

                selected, = ax.plot(-1,-1, markersize = 8, marker = 'o', markerfacecolor = "#7a00fc", markeredgecolor = "#7a00fc")

            #print(points)
            xs, ys = zip(*points)

            lineP.set_xdata(xs)
            lineP.set_ydata(ys)

            areaP.set_xy(points)

            ppp.set_xdata(xs)
            ppp.set_ydata(ys)

            areaa = max(math.floor(PolyArea(xs,ys) / circleArea),1)

            print(PolyArea(xs,ys))

            areaT.set_text(f'Max Capacity: {areaa}')

            cursor.set_ydata(event.ydata)
            cursor.set_xdata(event.xdata)

            fig.canvas.draw()
            fig.canvas.flush_events()

def onmove(event):
    global pickedUp, pickedPoint, firstPoint, selected

    if(event.y >= 150):

        cursor.set_ydata(event.ydata)
        cursor.set_xdata(event.xdata)

        if(pickedUp):
            if(pickedPoint == 0):
                points[len(points)-1][0] = event.xdata
                points[len(points)-1][1] = event.ydata

                firstPoint.set_xdata(event.xdata)
                firstPoint.set_ydata(event.ydata)

            # elif (pickedPoint == len(points)-1):
            #     points[0][0] = event.xdata
            #     points[0][1] = event.ydata

            points[pickedPoint][0] = event.xdata
            points[pickedPoint][1] = event.ydata

            xs, ys = zip(*points)
            ppp.set_xdata(xs)
            ppp.set_ydata(ys)

            selected.set_xdata(event.xdata)
            selected.set_ydata(event.ydata)

            areaa = max(math.floor(PolyArea(xs,ys) / circleArea),1)
            areaT.set_text(f'Max Capacity: {areaa}')

            lineP.set_xdata(xs)
            lineP.set_ydata(ys)
            areaP.set_xy(points)

        fig.canvas.draw()
        fig.canvas.flush_events()

def press(event):
    global pickedUp, pickedPoint
    if event.key == 'x' and pickedUp:
        del points[pickedPoint]
        if(pickedPoint == 0):
            del points[len(points)-1]
            firstPoint.set_xdata(points[0][0])
            firstPoint.set_ydata(points[0][1])
            points.append(points[0])
        pickedUp = False
        pickedPoint = -1

        xs, ys = zip(*points)
        ppp.set_xdata(xs)
        ppp.set_ydata(ys)

        selected.set_xdata(-1)
        selected.set_ydata(-1)

        areaa = max(math.floor(PolyArea(xs,ys) / circleArea),1)
        areaT.set_text(f'Max Capacity: {areaa}')

        lineP.set_xdata(xs)
        lineP.set_ydata(ys)
        areaP.set_xy(points)

    fig.canvas.draw()
    fig.canvas.flush_events()


fig.canvas.mpl_connect('button_press_event', onclick)
fig.canvas.mpl_connect('motion_notify_event', onmove)
fig.canvas.mpl_connect('key_press_event', press)

text_box = mpw.TextBox(scaleBox, 'Scale (m):', initial="10")
text_box.on_submit(update)

rad_box = mpw.TextBox(radiusBox, 'Radius (m):', initial="2")
rad_box.on_submit(radUpdate)

plt.show()
