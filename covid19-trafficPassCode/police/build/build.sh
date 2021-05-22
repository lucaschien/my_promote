#!/bin/bash
#--------------------------------------------------------------------- 
# Prepared program assets, and copy to deployment target server.
#	
# author: Lin, Bing-Jin 2018/12/12
#---------------------------------------------------------------------
PATH=/usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/usr/bin

# artifact information, 
# That will be injected from Jenkins by $POM_GROUPID, $POM_ARTIFACTID separately
GROPUP="${POM_GROUPID}"
ARTIFACT="${POM_ARTIFACTID}"
HOST="${TARGET_HOST}"
FINA_FILE="${HOST}_${ARTIFACT}.tar.gz"

# Working directories, $WORKSPACE is jenkins env.
WORK_DIR=$WORKSPACE
DIST_DIR=$WORK_DIR/dist
echo "working dir is ${WORK_DIR}, distribution folder path ${DIST_DIR}" >&2

npmbuild() {
	echo "npm install and build"
	cd $WORK_DIR
	/usr/local/bin/npm npm cache clean --force >> ./install.log 2>&1
	/usr/local/bin/npm install >> ./install.log 2>&1
	/usr/local/bin/npm run "${BUILD_NAME}" >> ./build.log 2>&1
	buildcomplete=$( cat ./build.log | grep 'Build complete' )
	if [ -z $buildcomplete ]; then
		echo "npm build failure, see ${WORK_DIR}/build.log for more details"
		exit 1
	else
		echo "npm build complete"
	fi
}

package() {
	echo "package distribution files"
	cd $WORK_DIR
	tar -czvf $WORK_DIR/$FINA_FILE -C $DIST_DIR .
}

main() {
	npmbuild
	package
}

main
